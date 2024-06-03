const express = require("express"),
  layouts = require("express-ejs-layouts"),
  app = express(),
  methodOverride = require("method-override"),
  sequelize = require("./config/database"), // Sequelize 인스턴스
  errorController = require("./controllers/errorController");

const loginRoutes = require("./routes/loginRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const keepRouter = require("./routes/keepRouter");
const mainhomeRoutes = require("./routes/mainhomeRoutes");

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");

// Middleware 설정
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));

// 라우트 설정
app.use("/", require("./routes/mainhomeRoutes"));
app.use("/", loginRoutes);
app.use("/", uploadRoutes);
app.use("/", matchingRoutes);
app.use("/", categoryRoutes);
app.use("/", keepRouter); // Add this line

// 에러 핸들링
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// 데이터베이스 모델 불러오기
const models = [
  require("./models/member"),
  require("./models/studentProfile"),
  require("./models/chatRoom"),
  require("./models/message"),
  require("./models/seniorProfile"),
  require("./models/matching"),
  require("./models/promise"),
  require("./models/review"),
  require("./models/interestField"),
  require("./models/report"),
  require("./models/keep")
];

// 데이터베이스 동기화 및 서버 시작
sequelize.sync().then(() => {
  app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
