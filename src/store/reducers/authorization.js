import { SET_LOGIN_MODAL_VISIBILITY } from '../actions/login/setLoginModalVisibility';
import { LOGIN_TO_BACKEND } from '../actions/login/loginToBackend';
import { LOGOUT_FROM_BACKEND } from '../actions/login/logoutFromBackend';

const initialState = {
  isLoginDialogVisible: false,
  error: undefined,
  username: '',
  password: '',
};

const authorization = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGIN_MODAL_VISIBILITY: {
      return {
        ...state,
        isLoginDialogVisible: action.isVisible,
        error: undefined,
      };
    }
    case `${LOGIN_TO_BACKEND}_SUCCESS`: {
      return {
        ...state,
        ...action.payload.data,
        isLoginDialogVisible: false,
        error: undefined,
      };
    }
    case `${LOGIN_TO_BACKEND}_FAIL`: {
      return {
        ...state,
        error: 'Login failed, please try again!',
      };
    }
    case `${LOGOUT_FROM_BACKEND}_FAIL`:
    case `${LOGOUT_FROM_BACKEND}_SUCCESS`: {
      return {
        ...state,
        refreshToken: undefined,
        accessToken: undefined,
      };
    }
    default:
      return state;
  }
};

export default authorization;
