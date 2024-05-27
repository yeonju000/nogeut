const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {
  senderNum: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false
  },
  receiverNum: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false
  },
  sendDay: {
    type: DataTypes.DATE,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  check: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Message;
