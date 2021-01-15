import React from "react";

export const SecondaryButton = ({ children, ...props }) => {
  return (
    <button className="button secondary-button" {...props}>
      {children}
    </button>
  );
};

export const PrimaryButton = ({ children, disabled = false, ...props }) => {
  return (
    <button
      disabled={disabled}
      className={`button ${disabled ? "button-disabled" : "primary-button"}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const LinkButton = ({ children, ...props }) => {
  return (
    <button className="button link-button" {...props}>
      {children}
    </button>
  );
};
