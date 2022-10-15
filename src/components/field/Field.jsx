import React from "react";

const Field = ({ children }) => {
  return (
    <div className="flex flex-col items-start gap-y-3 mt-8 px-44">
      {children}
    </div>
  );
};

export default Field;
