import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useParams,
} from "react-router-dom";
import App from "./App";

import React from "react";
import { v4 as uuidV4 } from "uuid";
const Reroute = () => {
  const { name, role } = useParams();
  return <Redirect to={`/${name}/${role}/${uuidV4()}`} />;
};

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to={`/nouser/0/${uuidV4()}`} />
        </Route>
        <Route exact path="/:name/:role/:id">
          <App />
        </Route>
        <Route exact path="/:name/:role">
          <Reroute />
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
