import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';
import { useHistory } from 'react-router-dom';
import Loading from '../Loading/Loading';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const emailFieldRef = useRef();
  const pwdFieldRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    const emailEnteredValue = emailFieldRef.current.value;
    const pwdEnteredValue = pwdFieldRef.current.value;
    let url;
    if (isLogin) {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDi95jTzFZ9jBfsZgI0RMqAim1uK6EKESk';
    } else {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDi95jTzFZ9jBfsZgI0RMqAim1uK6EKESk';
    }

    try {
      setLoading(true);
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: emailEnteredValue,
          password: pwdEnteredValue,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok && response.status == 400) {
        let errorMessage = 'Authentication Failed.';
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        setError(errorMessage);
      } else {
        let expiringTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        authCtx.login(data.idToken, expiringTime.toISOString());

        history.replace('/');
      }
    } catch (error) {
      console.log('Error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={formSubmissionHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailFieldRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={pwdFieldRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          {isLoading && <Loading />}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
          {error && <p>{error}</p>}
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
