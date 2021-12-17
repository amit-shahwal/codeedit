import React from "react";

import "./styless/output.css";
const output = (props) => {
  const dwonloadoutput = (event) => {
    console.log(props.output);
    var textToWrite = props.output;
    var fileNameToSaveAs = "OUTPUT";
    var textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      // downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  };
  return (
    <div>
      <div className="col">
        <h2>OUTPUT</h2>

        <textarea
          className="output"
          placeholder="OUTPUT"
          rows="200"
          value={props.output}
        ></textarea>
      </div>
      <div className="col">
        <button className="btn btn-secondary" onClick={dwonloadoutput}>Download</button>
      </div>
    </div>
  );
};

export default output;
