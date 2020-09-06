import { ACCOUNT } from "../actions/types";
import requestStates from "./request";

const DEFAULT_ACCOUNT = { loggedIn: false };

const account = (state = DEFAULT_ACCOUNT, action) => {
  switch (action.type) {
    case ACCOUNT.REQUEST:
      return { ...state, status: requestStates.requesting };
    case ACCOUNT.REQUEST_ERROR:
      return { ...state, status: requestStates.error, message: action.message };
    case ACCOUNT.REQUEST_SUCCESS:
      return {
        ...state,
        status: requestStates.success,
        message: action.message,
        loggedIn: true,
      };
    case ACCOUNT.REQUEST_SIGNUP_SUCCESS:
      return {
        ...state,
        status: requestStates.success,
        message: action.message,
      };
    case ACCOUNT.REQUEST_LOGOUT_SUCCESS:
      return {
        ...state,
        status: requestStates.success,
        message: action.message,
        loggedIn: false,
      };
    case ACCOUNT.REQUEST_AUTHENTICATED_SUCCESS:
      return {
        ...state,
        status: requestStates.success,
        message: action.message,
        loggedIn: action.authenticated,
      };
    default:
      return state;
  }
};

export default account;