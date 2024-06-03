import { take,call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
  postJwtLoginJava,
  postJwtLoginJavaHome
} from "../../../helpers/dealing_routes";
import { exists } from "i18next";

const fireBaseBackend = getFirebaseBackend();

function* loginUser({ payload: { user, history } }) { 
  try {
    if (process.env.REACT_APP_DEFAULTAUTH == 'prod') {
      console.log(user)

      const response = yield call(postJwtLoginJava, {
        email: user.email,
        senha: user.password,
      });

      console.log('allow')
      console.log(response)
      
      yield localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
      history('/dashboard');
    } else if (process.env.REACT_APP_DEFAULTAUTH == 'dev') {
      console.log(user)

      const response = yield call(postJwtLoginJavaHome, {
        email: user.email,
        senha: user.password,
      });

      console.log('allow')
      console.log(response)

      yield localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
      history('/dashboard');
    }
    console.log('asd')
    
  } catch (error) {
    console.log(error)
    console.log(error.message)
    yield put(apiError(error.message));
  }
}

// function* logoutUser({ payload: { history } }) {
//   try {
//     localStorage.removeItem("authUser");

//     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
//       const response = yield call(fireBaseBackend.logout);
//       yield put(logoutUserSuccess(response));
//     }
//     console.log("history",history)
//     history("/login");
//   } catch (error) {
//     yield put(apiError(error));
//   }
// }

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(response));
    }
    history('/login');
  } catch (error) {
    yield put(apiError(error));
  }
}


function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type,
      );
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    } else {
      const response = yield call(postSocialLogin, data);
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    }
    history("/dashboard");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
