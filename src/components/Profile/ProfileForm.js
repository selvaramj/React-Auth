import classes from './ProfileForm.module.css';
import AuthContext from '../../store/auth-context';
import { useContext, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Loading from '../Loading/Loading';

const ProfileForm = (props) => {
  console.log('From profile com', props);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const changePasswordRef = useRef();
  const authCtx = useContext(AuthContext);

  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    const enteredValue = changePasswordRef.current.value;
    setIsLoading(true);
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDi95jTzFZ9jBfsZgI0RMqAim1uK6EKESk',
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredValue,
          returnSecureToken: false,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log('Response', response, ' Data ', data);
    setIsLoading(false);
    if (response.ok) history.replace('/');
  };
  return (
    <form className={classes.form} onSubmit={formSubmissionHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={changePasswordRef} />
      </div>
      <div className={classes.action}>
        {!isLoading && <button>Change Password</button>}
        {isLoading && <Loading />}
      </div>
    </form>
  );
};

export default ProfileForm;
