const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const SeniorProfile = require("./seniorProfile");
const StudentProfile = require("./studentProfile");

const Promise = sequelize.define("Promise", {
  promiseNum: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  stdNum: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: StudentProfile,
      key: 'stdNum'
    }
  },
  protectorNum: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: SeniorProfile,
      key: 'seniorNum'
    }
  },
  roomNum: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  promiseCreationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  promiseDay: {
    type: DataTypes.DATE,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  finishTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  textSendingStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

module.exports = Promise;
