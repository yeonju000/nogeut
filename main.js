const express = require("express"),
  app = express(),
  methodOverride = require("method-override"),
  sequelize = require("./config/database"),
  errorController = require("./controllers/errorController"),
  creationRouter = require("./routes/creationRoutes.js"),
  loginController = require("./controllers/loginController.js"),
  mainController = require("./controllers/mainController.js"),
  session = require('express-session'),
  FileStore = require('session-file-store')(session);

const loginRoutes = require("./routes/loginRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const keepRouter = require("./routes/keepRouter");
const mainhomeRoutes = require("./routes/mainhomeRoutes");

const multer = require('multer');
const path = require('path');

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
  require("./models/keep"),
  require("./models/memberChatRoom")
];

const [Member, StudentProfile, ChatRoom, Message, SeniorProfile, Matching, Promise, Review, InterestField, Report, Keep, MemberChatRoom] = models;

// 모델 관계 설정
Member.hasOne(StudentProfile, { foreignKey: "memberNum" });
StudentProfile.belongsTo(Member, { foreignKey: "memberNum" });

Member.hasOne(SeniorProfile, { foreignKey: "memberNum" });
SeniorProfile.belongsTo(Member, { foreignKey: "memberNum" });

SeniorProfile.hasMany(Report, { foreignKey: "seniorNum" });
Report.belongsTo(SeniorProfile, { foreignKey: "seniorNum" });

StudentProfile.hasMany(Report, { foreignKey: "stdNum" });
Report.belongsTo(StudentProfile, { foreignKey: "stdNum" });

StudentProfile.hasMany(Keep, { foreignKey: "stdNum" });
Keep.belongsTo(StudentProfile, { foreignKey: "stdNum" });

SeniorProfile.hasMany(Keep, { foreignKey: "seniorNum" });
Keep.belongsTo(SeniorProfile, { foreignKey: "seniorNum" });

ChatRoom.hasMany(Message, { foreignKey: "roomNum" });
Message.belongsTo(ChatRoom, { foreignKey: "roomNum" });

StudentProfile.belongsToMany(SeniorProfile, { through: Matching, foreignKey: "stdNum" });
SeniorProfile.belongsToMany(StudentProfile, { through: Matching, foreignKey: "seniorNum" });

Member.belongsToMany(ChatRoom, { through: MemberChatRoom, foreignKey: "memberNum" });
ChatRoom.belongsToMany(Member, { through: MemberChatRoom, foreignKey: "roomNum" });

StudentProfile.belongsToMany(SeniorProfile, { through: Promise, foreignKey: "stdNum" });
SeniorProfile.belongsToMany(StudentProfile, { through: Promise, foreignKey: "seniorNum" });

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");

// Middleware 설정
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: 'ggongggong_cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// 로그인 페이지로 이동
app.get("/", loginController.connect);

app.get("/login", loginController.login);
app.post("/login", loginController.postLogin);

app.get("/main", mainController.mainRender);

app.use("/creation", creationRouter);

app.use("/", mainhomeRoutes);
app.use("/", loginRoutes);
app.use("/", uploadRoutes);
app.use("/", matchingRoutes);
app.use("/", categoryRoutes);
app.use("/", keepRouter);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

sequelize.sync().then(() => {
  app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
