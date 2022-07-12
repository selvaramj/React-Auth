import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

const ProtectedRoute = ({ component: Component, ...restProps }) => {
  const authCtx = useContext(AuthContext);
  const isUserLoggedIn = authCtx.isLoggedIn;
  return (
    <Route
      {...restProps}
      render={(props) =>
        isUserLoggedIn ? <Component {...props} /> : <Redirect to='/auth' />
      }
    />
  );
};

export default ProtectedRoute;
