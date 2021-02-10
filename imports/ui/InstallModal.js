import React, { useState } from "react";
import { FiShare } from "react-icons/fi";
import localforage from "localforage";

export const InstallPWA = () => {
  const [hide, setHide] = useState(false);
  return (
    <div className={hide ? `install-modal hide` : "install-modal"}>
      <div className="install-arrow" />
      Install this webapp on your phone: tap <FiShare /> and then Add to
      Homescreen
      <div className="install-close">
        <div
          className="install-button"
          onClick={() => {
            setHide(true);
            localforage.setItem("dismissedPrompt", true);
          }}
        >
          Close
        </div>
      </div>
    </div>
  );
};
