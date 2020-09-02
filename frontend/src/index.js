import React from "react";
import { render } from "react-dom";
import store from "./store";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { setAuthenticatedAction } from "./actions/accountAction";
import "bootstrap-css-only/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mdbreact/dist/css/mdb.css";
import "./index.css";
import Root from "./components/Root/Root";
import Home from "./components/UserHome/homepage";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";

const AuthRoute = (props) => {
  if (!store.getState().loggedIn) {
    return <Redirect to={{ pathname: "/" }} />;
  }

  const { component, path } = props;

  return <Route path={path} component={component} />;
};

store.dispatch(setAuthenticatedAction()).then(() => {
  render(
    <Provider store={store}>
      <Router>
        <Route exact path="/" component={Root} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        <AuthRoute path="/home" component={Home} />
      </Router>
    </Provider>,
    document.getElementById("root")
  );
});
