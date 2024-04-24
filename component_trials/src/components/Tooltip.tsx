import React, { useState } from "react";

interface TooltipProps {
  text: string;
  direction?: string;
  children: React.ReactNode; // Add children prop

}

const Tooltip: React.FC<TooltipProps> = ({text, direction, children}) => {
const [show, setShow] = React.useState(false);

  return (
    <div>
      <div className="tooltip" style={show ? { visibility: "visible" } : {}}>
        {text}
        <span className="tooltip-arrow" />
      </div>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
    </div>
  );
};

export default Tooltip;
