const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

//ejs 템플릿 엔진 설정
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//정적파일경로, express 미들웨어 설정
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// MongoDB 연결
// mongoose.connect("mongodb://localhost:27017/NoteApp", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect("mongodb://127.0.0.1:27017/NoteApp");

// 연결 이벤트 리스너
mongoose.connection.on("connected", () => {
  console.log("MongoDB에 연결되었습니다.");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 오류:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB와의 연결이 끊어졌습니다.");
});

// 메모 스키마 생성
const memoSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// 메모 모델 생성
const Memo = mongoose.model("Memo", memoSchema, "memos");

// 메모 리스트 보기
app.get("/", async (req, res) => {
  try {
    const memos = await Memo.find();
    res.render("list", { memos });
  } catch (err) {
    console.error(err);
    res.send("오류가 발생했습니다.");
  }
});

// 메모 작성 페이지 보기
app.get("/new", (req, res) => {
  res.render("new");
});

// 메모 작성 처리
app.post("/create", async (req, res) => {
  try {
    await Memo.create(req.body);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("메모 작성 중 오류가 발생했습니다.");
  }
});

// 메모 상세페이지 보기
app.get("/show/:id", async (req, res) => {
  try {
    const memoId = req.params.id;
    const memo = await Memo.findById(memoId);
    if (!memo) {
      return res.status(404).send("Memo not found");
    }
    res.render("show", { memo });
  } catch (err) {
    console.error(err);
    res.status(500).send("메모 상세페이지에서 오류가 발생했습니다.");
  }
});

// 메모 수정 페이지 보기
app.get("/edit/:id", async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    res.render("edit", { memo });
  } catch (err) {
    console.error(err);
    res.send("메모 조회 중 오류가 발생했습니다.");
  }
});

// 메모 수정 처리
app.post("/update/:id", async (req, res) => {
  try {
    await Memo.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/show/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.send("메모 수정 중 오류가 발생했습니다.");
  }
});

// 메모 삭제 처리
app.get("/delete/:id", async (req, res) => {
  try {
    const memoId = req.params.id;
    await Memo.findByIdAndDelete(memoId);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("메모 삭제 중 오류가 발생했습니다.");
  }
});

app.post("/delete/:id", async (req, res) => {
  try {
    const memoId = req.params.id;
    await Memo.findByIdAndDelete(memoId);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("메모 삭제 중 오류가 발생했습니다.");
  }
});

// 서버 시작
const port = 3000;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
