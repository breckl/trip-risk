import React from "react";
import { useHistory } from "react-router-dom";
import { ChevronLeft } from "react-bootstrap-icons";

export const NewAircraft = () => {
  let history = useHistory();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className="section"
        style={{ width: "80px", padding: "0px" }}
        onClick={() => history.push("/")}
      >
        <ChevronLeft size={23} />
      </div>
      <div>
        <input placeHolder="Aircraft" />
      </div>
    </div>
  );
};
