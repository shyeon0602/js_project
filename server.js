const express = require("express");
const app = express();

//홈 html파일 연결
app.get("/", (req, res) => {
  // res.send("Hello World!");
  //__dirname: server.js 경로 불러오기
  res.sendFile(__dirname + "/main-page/main.html");
});

//css 적용
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
