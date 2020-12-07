import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { SecondaryButton, PrimaryButton } from "./common/Button";
import { AircraftsCollection } from "/imports/api/aircrafts";
import { useHistory } from "react-router-dom";

export const AircraftListView = () => {
  let history = useHistory();
  let { aircrafts, loading } = useTracker(() => {
    return {
      loading: !Meteor.subscribe("allAircrafts").ready(),
      aircrafts: AircraftsCollection.find({}).fetch(),
    };
  });
  return loading ? (
    <div>loading</div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ margin: "10px 0" }}>Choose an aircraft:</div>
      {aircrafts.map((plane) => {
        return (
          <SecondaryButton
            // className="section"
            style={{ width: "80%", marginBottom: "15px", height: "45px" }}
            key={plane.aircraftId}
            onClick={() => history.push(`/tasks/${plane.aircraftId}`)}
          >
            {plane.name}
          </SecondaryButton>
        );
      })}
      <PrimaryButton
        onClick={() => history.push(`/new-aircraft`)}
        style={{ width: "80%", height: "45px" }}
      >
        + New Aircraft
      </PrimaryButton>
    </div>
  );
};
