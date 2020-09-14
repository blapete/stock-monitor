import requestStates from "./request";
import { ACCOUNT_STOCKS } from "../actions/types";

const DEFAULT_STOCKS_DATA = {
  favorites: [],
  message: "",
};

const stocks = (state = DEFAULT_STOCKS_DATA, action) => {
  switch (action.type) {
    case ACCOUNT_STOCKS.REQUEST:
      return { ...state, status: requestStates.requesting };
    case ACCOUNT_STOCKS.REQUEST_ERROR:
      return { ...state, status: requestStates.error, message: action.message };
    case ACCOUNT_STOCKS.REQUEST_ADD_SUCCESS:
      return {
        ...state,
        status: requestStates.success,
        message: action.message,
      };
    case ACCOUNT_STOCKS.REQUEST_DELETE_SUCCESS:
      return {
        ...state,
        status: requestStates.success,
        message: action.message,
        favorites: action.favorites,
      };
    case ACCOUNT_STOCKS.REQUEST_ALLSTOCKS_SUCCESS:
      return {
        ...state,
        status: requestStates.success,
        message: action.message,
        favorites: action.favorites,
      };
    case ACCOUNT_STOCKS.RESET:
      return {
        ...state,
        stock_quote: {},
        message: "",
        favorites: [],
      };
    default:
      return state;
  }
};

export default stocks;
