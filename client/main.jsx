import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { App } from "/imports/ui/App";
import localforage from "localforage";
import { tasks } from "./InitialData";

Meteor.startup(() => {
  localforage.config({
    driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
    name: "tripRisk",
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: "trip_risk", // Should be alphanumeric, with underscores.
    description: "Trip Risk Data",
  });

  // localforage.removeItem("tasks");
  // localforage.removeItem("aircrafts");
  localforage.getItem("aircrafts").then((resp) => {
    console.log(resp);
    if (!resp) {
      localforage.setItem("aircrafts", [
        {
          aircraftId: 2,
          name: "P-51 Mustang",
          passingValue: 10,
        },
        {
          aircraftId: 1,
          name: "Twin Cessna",
          passingValue: 10,
        },
      ]);
    }
  });
  console.log("start up");
  localforage.getItem("tasks").then((resp) => {
    console.log(resp);
    if (!resp) {
      localforage.setItem("tasks", tasks);
    }
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById("react-target")
    );
  });
});
