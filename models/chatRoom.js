const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ChatRoom = sequelize.define("ChatRoom", {
  roomNum: {
    type: DataTypes.INTEGER,
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
