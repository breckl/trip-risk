import React from "react";

export const ConnectionStatus = ({ offline }) => {
  if (offline) {
    return <div className="offline">Offline</div>;
  }

  return null;
};
