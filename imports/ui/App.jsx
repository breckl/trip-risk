import React from "react";
import { AircraftListView } from "./AircraftListView";
import { AircraftChecklistView } from "./AircraftChecklistView";

export const App = () => {
  const [view, setView] = React.useState("aircraft");
  const [currentAircraft, setCurrentAircraft] = React.useState();

  return (
    <div>
      <div style={{ margin: "10px 0", fontWeight: "bold" }}>
        Trip Risk Assessment
      </div>
      {/* AIRCRAFT LIST */}
      {view == "aircraft" && (        
        <AircraftListView
          setView={(value) => {
            setView("tasks");
            setCurrentAircraft(value);
          }}
        />
      )}
      {/* AIRCRAFT CHECK LIST */}
      {view == "tasks" && <AircraftChecklistView aircraft={currentAircraft} goBack={()=>setView("aircraft")} />}
    </div>
  );
};
