import React from "react";
import { AircraftView } from "./AircraftView";
import { TaskView } from "./TaskView";

export const App = () => {
  const [view, setView] = React.useState("aircraft");
  const [currentAircraft, setCurrentAircraft] = React.useState();

  return (
    <div>
      <div style={{ margin: "10px 0", fontWeight: "bold" }}>
        Trip Risk Assessment
      </div>
      {view == "aircraft" && (
        <AircraftView
          setView={(value) => {
            setView("tasks");
            setCurrentAircraft(value);
          }}
        />
      )}
      {view == "tasks" && <TaskView aircraft={currentAircraft} />}
    </div>
  );
};
