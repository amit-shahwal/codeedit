import React, { useEffect, useState } from "react";
import { getResult, getcodeTosave, getSavedCode } from "./API_HELPER/code";
import "./styless/editor.css";

import CodeMirror from "@uiw/react-codemirror";

import { javascript } from "@codemirror/lang-javascript";
import { io } from "socket.io-client";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Editor = (props) => {
  var timeout;
  let history = useHistory();
  const [socket, setSocket] = useState();

  const { id: codeId, name: user_name, role } = useParams();
  const [typing, setTyping] = useState(false);
  const [typinguser, setTypinguser] = useState("You're");
  const [values, setValues] = useState({
    language: "language",
    input: props.input,
  });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingsavedcode, setloadingsavedcode] = useState(true);
  const [codenumber, setCodeNumber] = useState(1);
  const [placeHolder, setplaceHolder] = useState(
    "Write your code Here , no previous code found!!"
  );
  useEffect(() => {
    getSavedCode({ user_name })
      .then((data) => {
        setloadingsavedcode(false);
        props.changesavedcodeload(false);
        // console.log(data.code);
        if (data.code[2]) setCode(data.code[2]);
        else if (data.code[1]) setCode(data.code[1]);
        else if (data.code[0]) setCode(data.code[0]);
      })
      .catch();

    const s = io("/", {
      transport: ["websocket"],
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  const { language, input } = values;

  // yha pe useeffect htaye hai kyu ki hmesha jab v language chabge ho rha tha to dusre editor se khaali language send kr de rha tha isse dikkat ho ja rha tha

  // useEffect(() => {
  //   if (socket == null) return;
  //   socket.emit("send-changes", code, language);
  // }, [socket, code ,language]);

  useEffect(() => {
    if (socket == null) return;
    const handler = (code, language) => {
      // console.log(`${user_name}:-${role}`);
      if (timeout !== undefined) clearTimeout(timeout);
      timeout = setTimeout(function () {
        setTyping(false);
        setTypinguser("You're");
        if (role != 1) {
          setCode(code);
          setValues({ ...values, language: language });
        }
      }, 1000);
    };

    socket.on("recieve-changes", handler);
  }, [socket, language]);

  useEffect(() => {
    if (socket == null) return;
    socket.emit("get-codeId", codeId, user_name, role);
  }, [socket, codeId]);

  useEffect(() => {
    if (language === "cpp" && code === "") {
      var precode = [
        "#include <bits/stdc++.h>",
        "using namespace std;",
        "int main() {",
        " ",
        "// Write your code here👨‍💻",
        ` cout << "Hello ${user_name}, C++ Codify-World!" << endl;`,
        " ",
        "}",
      ].join("\n");
      setCode(precode);
      // avi yha pe daale hai dkhne ke liye ki kya language chnage krne ke baad sab sahi chlta hai
      // socket.emit("send-changes", code, language);
    }
  }, [language]);

  const hideAlert = () => {
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
  };

  // type is 'success' or 'error'
  const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout(hideAlert, 2000);
  };

  useEffect(() => {
    if (socket == null) return;
    const rhandler = (name) => {
      const uname = name.replace(/^./, name[0].toUpperCase());
      showAlert("success", `${uname} connected to your Editor!!`);
    };
    socket.on("recieve-name", rhandler);
  }, [socket, codeId, user_name]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  useEffect(() => {
    if (socket == null) return;
    const rhandler = (name) => {
      const uname = name.replace(/^./, name[0].toUpperCase());
      showAlert("error", `${uname} disconnected from your Editor!!`);
    };
    socket.on("disconnect-name", rhandler);
  }, [socket]);

  useEffect(() => {
    setValues({ ...values, input: props.input });
  }, [props.input, language]);

  const onSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setValues({ ...values });
    getResult({ code, language, input })
      .then((data) => {
        setLoading(false);
        console.log(data);
        
        if (data.error && data.error !== "null") {
          props.changeError(data.error);
          props.changeoutput("");
        } else {
          props.changeoutput(data.output);
          props.changeError("");
          onSubmitCode();
          // getSavedCode({user_name});
        }
      })
      .catch();
  };

  const onSubmitCode = () => {
    getcodeTosave({ code, user_name })
      .then((data) => {
        //no need here anything
      })
      .catch();
  };

  const onGetLastCode = (event) => {
    event.preventDefault();
    console.log(codenumber);
    setLoadingCode(true);
    getSavedCode({ user_name })
      .then((data) => {
        console.log(data.code);
        setLoadingCode(false);
        if (!data.code[codenumber - 1]) setCode
        (placeHolder);
        else setCode(data.code[codenumber - 1]);
      })
      .catch();
  };

  const onclikcEvent = () => {
    props.changeError("");
  };

  const handleCode = (value) => {
    setCode(value);
  };

  const [typingtimer, setTypingtimer] = useState(0);

  const typingtimerfun = () => {
    if (typingtimer) clearTimeout(typingtimer);
    setTypingtimer(
      setTimeout(() => {
        setTyping(false);
      }, 1000)
    );
  };
  const onkeypressevent = () => {
    setTyping(true);

    if (socket == null) return;
    console.log("amit"); // here we can send the data to next machine
    socket.emit("send-changes", code, language);
    socket.emit("send-typing", typing, user_name);
    typingtimerfun();
  };

  useEffect(() => {
    if (socket == null) return;
    const thandler = (typing, u_name) => {
      // console.log(`uname:-${u_name}`);
      setTyping(typing);
      setTypinguser(u_name);
    };
    socket.on("recieve-typing", thandler);
  }, [onkeypressevent]);
  const runViacntrl_Enter = (e) => {
    if (e.ctrlKey && e.keyCode == 13) {
      onSubmit(e);
    }
  };

  const getcodenumber = (event) => {
    setCodeNumber(event.target.value);
    console.log(codenumber);
  };
  return (
    <>
      {/* <CodeMirror
      className="editor"
        // value="console.log('hello world!');"
        height="500px"
        extensions={[javascript({ jsx: true })]}
        onChange={(value, viewUpdate) => {
          console.log("value:", value);
        }}
        className="editor"
        placeholder="Place code Here"
        rows="200"
        id="kkk"
        spellCheck="false"
        // onChange={handleCode}
         value={code}
        onClick={onclikcEvent}
        onKeyUp={onkeypressevent}
        disabled={role && typinguser === "You're" ? false : true}
        onKeyDown={runViacntrl_Enter}
      /> */}
      <img
        src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
        alt="Loading..."
        style={{
          display: loadingsavedcode ? "" : "none",
          width: 467,
          marginLeft: 526,
          marginTop: 121,
        }}
      />
      <div style={{ display: !loadingsavedcode ? "" : "none" }}>
        <h2 id="code-editor">WELCOME TO CODIFY , {user_name.toUpperCase()} </h2>
        <div style={{ marginLeft: 55 }}>
          {role != 1 ? (
            <label class="switch">
              <input type="checkbox" />
              <span
                class="slider round"
                onClick={() => {
                  history.push(`/${user_name}/1/${codeId}`);
                  window.location.reload();
                }}
              ></span>
            </label>
          ) : (
            <label class="switch">
              <input type="checkbox" checked />
              <span
                class="slider round"
                onClick={() => {
                  history.push(`/${user_name}/0/${codeId}`);
                  window.location.reload();
                }}
              ></span>
            </label>
          )}
        </div>
        <CopyToClipboard text={codeId}>
          <h5 onClick={() => showAlert("error", "Copied")}>
            Id:-{codeId} &nbsp;{" "}
            <a href="#" style={{ textDecoration: "none" }}>
              *COPY ID*
            </a>
          </h5>
        </CopyToClipboard>

        <CodeMirror
          className="editor"
          theme="dark"
          extensions={[javascript({ jsx: true })]}
          onChange={(value, viewUpdate) => {
            // console.log("value:", value);
            handleCode(value);
          }}
          placeholder={placeHolder}
          // rows="200"
          // id="kkk"
          // spellCheck="false"
          height="500px"
          // onChange={handleCode}
          value={code}
          onClick={onclikcEvent}
          onKeyUp={onkeypressevent}
          editable={role && typinguser === "You're" ? true : false}
          onKeyDown={runViacntrl_Enter}
        />

        <div className="row">
          <div className="col-12 ">
            <div className="row ml-1">
              <button
                style={{ display: !loading ? "" : "none", marginLeft: 50 }}
                type="button"
                className="btn btn-outline-success w-25"
                onClick={onSubmit}
              >
                RUN
              </button>
              <button
                style={{ display: !loadingCode ? "" : "none", marginLeft: 50 }}
                type="button"
                className="btn btn-outline-success w-25"
                onClick={onGetLastCode}
              >
                GET-LAST-CODE
              </button>

              <div style={{ float: "left", marginLeft: 30, marginTop: 8 }}>
                {typing && typinguser === "You're" ? (
                  <h4 id="typingIndicator" style={{ verticalAlign: "middle" }}>
                    {typinguser} typing....
                  </h4>
                ) : null}
                {typing && typinguser !== "You're" && role != 1 ? (
                  <h4 id="typingIndicator" style={{ verticalAlign: "middle" }}>
                    {typinguser} is typing....
                  </h4>
                ) : null}
              </div>
            </div>

            <div className="row">
              <img
                src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
                alt="Loading..."
                style={{
                  display: loading || loadingCode ? "" : "none",
                  width: 50,
                  marginLeft: 100,
                  marginTop: 10,
                }}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="row ml-1 mt-2">
              <div className="form-group w-25  mt-3 ml-5">
                <select
                  onChange={handleChange("language")}
                  className="form-control ml-1"
                  value={language}
                >
                  <option>language</option>
                  <option>cpp</option>
                  <option>python3</option>
                  <option>javascript</option>
                </select>
              </div>
              <div className="form-group w-25  mt-3 ml-5">
                <select
                  onChange={getcodenumber}
                  className="form-control ml-1"
                  value={codenumber}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
