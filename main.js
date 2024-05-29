const express = require("express"),
  layouts = require("express-ejs-layouts"),
  app = express(),
  router = express.Router(),
  errorController = require("./controllers/errorController"),
  categoryController = require("./controllers/categoryController.js"),
  loginController = require("./controllers/loginController.js"),
  methodOverride = require("method-override"),
  multer = require("multer"),
  sequelize = require("./config/database"); // Sequelize 인스턴스

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 정적 파일 제공 설정
app.use(express.static("public"));

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

router.use(layouts);

router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(express.json());

// 파일 업로드 라우트
router.post("/upload", upload.single("image"), (req, res) => {
  res.send("파일 업로드 완료");
});

//로그인 페이지로 이동
//app.get("/", loginController.connect);
//app.post("/", loginController.login);
router.get("/", loginController.connect);
router.post("/", loginController.login);
// 카테고리 라우트
router.get("/categories", categoryController.index, categoryController.indexView);
router.get("/categories/new", categoryController.new);
router.post("/categories/create", categoryController.create, categoryController.redirectView);
router.get("/categories/:id/edit", categoryController.edit);
router.put("/categories/:id/update", categoryController.update, categoryController.redirectView);
router.get("/categories/:id", categoryController.show, categoryController.showView);
router.delete("/categories/:id/delete", categoryController.delete, categoryController.redirectView);

// 에러 핸들링
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);

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
