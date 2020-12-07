import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { App } from "/imports/ui/App";
import localforage from "localforage";
// var foo = new Ground.Collection("test");
console.log(localforage);
Meteor.startup(() => {
  console.log("config");
  localforage.config({
    driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
    name: "tripRisk",
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: "trip_risk", // Should be alphanumeric, with underscores.
    description: "Trip Risk Data",
  });

  var aircrafts = localforage.createInstance({
    name: "aircrafts",
  });

  // aircrafts.setItem("test", "testing this");
  aircrafts.getItem("test").then((resp) => {
    console.log(resp);
  });

  var tasks = localforage.createInstance({
    name: "tasks",
  });
  // console.log(foo);
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("react-target")
  );
});
