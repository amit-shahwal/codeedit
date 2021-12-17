require("dotenv").config();
const express = require("express");

const compression = require("compression");

const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const codeapi = require("./codeapi");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    });
    console.log("connected successfully");
  } catch (Error) {
    console.log(Error);
  }
};
connectDB();
app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
// app.use(express.json());
app.use(cors());
app.use(compression());

app.post("/api/coderun", codeapi.codifyapi);
app.post("/api/codeall", codeapi.codifyall);
app.post("/api/output", codeapi.statuss);
app.post("/api/savecode", codeapi.saveCode);
app.post("/api/getSavedCode", codeapi.getSavedCode);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("frontend/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}
var timeout;
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("get-codeId", (codeId, user_name, role) => {
    socket.join(codeId);
    console.log(role);
    socket.on("disconnect", () => {
      socket.broadcast.to(codeId).emit("disconnect-name", user_name);
    });
    socket.on("send-typing", (typing, u_name) => {
      //console.log(u_name);
      socket.broadcast.to(codeId).emit("recieve-typing", typing, u_name);
    });

    socket.broadcast.to(codeId).emit("recieve-name", user_name);

    socket.on("send-changes", (code, language) => {
      // console.log(code);

      socket.broadcast.to(codeId).emit("recieve-changes", code, language);
    });
  });
});

server.listen(process.env.PORT || 6666);
