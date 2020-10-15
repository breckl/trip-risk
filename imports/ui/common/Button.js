import React from "react";

export const SecondaryButton = ({ children, ...props }) => {
  return (
    <button className="button secondary-button" {...props}>
      {children}
    </button>
  );
};

export const PrimaryButton = ({ children, ...props }) => {
  return (
    <button className="button primary-button" {...props}>
    {children}
  </button>  
  )
}

export const LinkButton = ({ children, ...props}) => {
  return (
    <button className="link-button" {...props}>
      {children}
    </button>
  )
}
