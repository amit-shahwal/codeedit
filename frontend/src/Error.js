import React from "react";
import "./styless/error.css";
const Error = (props) => {
  var boo = false;
  if (props.error === "") boo = true;
  return (
    <div style={{ display: !boo ? "" : "none" }}>
      <h2>Error</h2>
      <textarea
        disabled
        className="error"
        placeholder={props.error}
        rows="200"
        // value={props.error}
      ></textarea>
    </div>
  );
};

export default Error;
