const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Member = require("./member");
const ChatRoom = require("./chatRoom");

const MemberChatRoom = sequelize.define('MemberChatRoom', {
  memberNum: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Members',
      key: 'memberNum'
    }
  },
  roomNum: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'ChatRooms',
      key: 'roomNum'
    }
  }
}, {
  timestamps: false
});

module.exports = MemberChatRoom;
