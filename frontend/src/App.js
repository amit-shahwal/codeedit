import React, { useState } from "react";
import Editor from "./Editor";
import Error from "./Error";
import Input from "./Input";
import Output from "./Output";

const App = (props) => {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [savedcodeload, setsavedcodeload] = useState(true);

  return (
    <div className="c">
      <div className="row row no-gutters">
        <div className=" col-12 col-sm-6 col-md-8">
          <Editor
            changeoutput={(output) => setOutput(output)}
            changeError={(error) => setError(error)}
            changesavedcodeload={(savedcodeload) => setsavedcodeload(savedcodeload)}
            input={input}
            id={props.id}
          />
        </div>
        <div className="col-6 col-md-4">
          <div className="row " style={{ display: !savedcodeload ? "" : "none" }}>
            <Input changeInput={(input) => setInput(input)} />
          </div>
          <div className="row " style={{ display: !savedcodeload ? "" : "none" }}>
            <Output output={output} />
          </div>
          <div className="row ">
            <Error error={error} />
          </div>
          {/* <h1>hii</h1> */}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default App;
