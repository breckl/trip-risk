// import { Meteor } from "meteor/meteor";
// import { TasksCollection } from "/imports/api/tasks";
// import { AircraftsCollection } from "/imports/api/aircrafts";
// import { tasks } from "./InitialData";

// Meteor.startup(() => {
//   if (AircraftsCollection.find().count() === 0) {
//     AircraftsCollection.insert({
//       aircraftId: 1,
//       name: "Twin Cessna",
//       passingValue: 10,
//     });
//     AircraftsCollection.insert({
//       aircraftId: 2,
//       name: "P-51 Mustang",
//       passingValue: 10,
//     });
//   }
//   if (TasksCollection.find({}).count() === 0) {
//     console.log("adding default data");
//     tasks.forEach((i) => {
//       TasksCollection.insert(i);
//     });
//   }
// });
