const express = require("express");
const app = express();

app.get("/", (req, res) => {
  // res.send("Hello World!");
  //__dirname: server.js 경로 불러오기
  res.sendFile(__dirname + "/main-page/main.html");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
