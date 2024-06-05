const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ChatRoom = sequelize.define("ChatRoom", {
  roomNum: {
    type: DataTypes.BIGINT,  // 여기서 INTEGER를 BIGINT로 변경
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  stdNum: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  protectorNum: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  roomCreationTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

module.exports = ChatRoom;