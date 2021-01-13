import React, { Suspense } from "react";
// import { AircraftListView } from "./AircraftListView";
// import { AircraftChecklistView } from "./AircraftChecklistView";
// import { NewAircraft } from "./NewAircraft";
// import Header from "./Header";
import { Switch, Route } from "react-router-dom";
const AircraftListView = React.lazy(() => import("./AircraftListView"));
const AircraftChecklistView = React.lazy(() =>
  import("./AircraftChecklistView")
);
const NewAircraft = React.lazy(() => import("./NewAircraft"));
const Header = React.lazy(() => import("./Header"));

export const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </div>
  );
};
