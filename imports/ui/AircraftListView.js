import React from "react";
import { SecondaryButton, PrimaryButton } from "./common/Button";
import { useHistory } from "react-router-dom";
import localforage from "localforage";

export const AircraftListView = () => {
  let history = useHistory();
  const [aircrafts, setAircrafts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    localforage.getItem("aircrafts").then((resp) => {
      if (!resp || resp.length == 0) {
        setLoading(false);
        return;
      }
      setAircrafts(resp);
      setLoading(false);
    });
  }, []);
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
