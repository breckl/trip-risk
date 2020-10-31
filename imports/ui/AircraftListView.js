import React from "react";
import { SecondaryButton, PrimaryButton } from "./common/Button";

export const AircraftListView = ({ setView }) => {
  return (
    <div>
      <div style={{ margin: "10px 0" }}>Choose an aircraft:</div>
      <SecondaryButton onClick={() => setView("Twin Cessna")}>Twin Cessna</SecondaryButton>
      <SecondaryButton onClick={() => setView("P-51 Mustang")}>P-51 Mustang</SecondaryButton>
      <PrimaryButton onClick={() => setView("NEW") }>+ New Aircraft</PrimaryButton>
    </div>
  );
};