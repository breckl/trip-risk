import React from "react";
import { AircraftListView } from "./AircraftListView";
import { AircraftChecklistView } from "./AircraftChecklistView";
import { NewAircraft } from "./NewAircraft";
import Header from "./Header";
import { Switch, Route } from "react-router-dom";

export const App = () => {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/">
          <AircraftListView />
        </Route>
        <Route exact path="/tasks/:id">
          <AircraftChecklistView />
        </Route>
        <Route exact path="/new-aircraft">
          <NewAircraft />
        </Route>
      </Switch>
    </div>
  );
};
