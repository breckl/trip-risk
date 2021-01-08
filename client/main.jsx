import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { App } from "/imports/ui/App";
import localforage from "localforage";
import { tasks } from "./InitialData";

import "../imports/startup/client/";

Meteor.startup(() => {
  localforage.config({
    driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name: "tripRisk",
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: "trip_risk", // Should be alphanumeric, with underscores.
    description: "Trip Risk Data",
  });

  //localforage.removeItem("tasks");
  //localforage.removeItem("aircrafts");
  localforage.getItem("aircrafts").then((resp) => {
    if (!resp || resp.length == 0) {
      localforage.setItem("aircrafts", [
        {
          aircraftId: 1,
          name: "Twin Cessna",
          passingValue: 10,
          cautionValue: 6,
        },
      ]);
    }
  });
  localforage.getItem("tasks").then((resp) => {
    if (!resp || resp.length == 0) {
      localforage.setItem("tasks", tasks);
    }
  });
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("react-target")
  );
});
