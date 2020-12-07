import { check } from "meteor/check";

export const AircraftsCollection = new Mongo.Collection("aircrafts");
if (Meteor.isServer) {
  Meteor.publish("allAircrafts", function () {
    return AircraftsCollection.find({});
  });
  Meteor.publish("aircraft", function (aircraftId) {
    check(aircraftId, String);
    return AircraftsCollection.find({ aircraftId: aircraftId });
  });
}
