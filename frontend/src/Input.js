import React, { useEffect, useState } from "react";
import "./styless/input.css";
const Input = (props) => {
  const [inputTodwonload, setinputTodwonload] = useState("");
  const handleChange = (event) => {
    props.changeInput(event.target.value);
    setinputTodwonload(event.target.value);
  };
  const downloadinput = (event) => {
    console.log(props.output);
    var textToWrite = inputTodwonload;
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
  const chnagefile = (e) => {
    // const content = document.querySelector(".content");
    const [file] = document.querySelector("input[type=file]").files;
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        // this will then display a text file
        console.log(reader.result);
        setinputTodwonload(reader.result);
        props.changeInput(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <div className="col">
        <h2 id="input-area">Input-Area</h2>
        <textarea
          className="input"
          placeholder="INPUT/OPTIONAL"
          rows="200"
          onChange={handleChange}
          spellCheck="false"
          value={inputTodwonload}
        ></textarea>
      </div>
      <div className="col">
        <input
          className="input-group-text"
          onChange={chnagefile}
          type="file"
          id="js-file"
          accept=".txt,.css,.html"
        />
        {/* <button onClick={downloadinput}>Download</button> */}
      </div>
    </div>
  );
};

export default Input;
