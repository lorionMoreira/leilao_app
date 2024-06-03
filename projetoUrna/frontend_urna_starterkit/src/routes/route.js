import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/actions";
const Authmiddleware = (props) => {
  const dispatch = useDispatch();
  
  const authUser = localStorage.getItem("authUser");
  if (!authUser) {
    return (
      <Navigate to={{ pathname: "/login-safe", state: { from: props.location } }} />
    );
  }
  useEffect(() => {
    if (authUser) {
     const authUserParsed =JSON.parse(authUser)
      dispatch(loginSuccess(authUserParsed));
    }
  }, [authUser, dispatch]);

    return (<React.Fragment>
      {props.children}
    </React.Fragment>);
  

};

export default Authmiddleware;
