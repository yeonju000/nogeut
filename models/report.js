const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const SeniorProfile = require("./seniorProfile"); // SeniorProfile 모델 불러오기
const StudentProfile = require("./studentProfile");
const Member=require("./member");

const Report = sequelize.define("Report", {
  reportNum: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  reportContent: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  reportMedia: {
    type: DataTypes.BLOB("medium"),
    allowNull: false
  },
  seniorNum: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  stdNum: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  timestamps: true
});
Report.belongsTo(Member, { as: 'student', foreignKey: 'stdNum' });
Report.belongsTo(SeniorProfile, { as: 'senior', foreignKey: 'seniorNum' });

Member.hasMany(Report, { foreignKey: 'stdNum' });
SeniorProfile.hasMany(Report, { foreignKey: 'seniorNum' });
module.exports = Report;
