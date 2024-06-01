const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Member = sequelize.define("Member", {
  memberNum: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false
  },
  memberID: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  memberPW: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  profileCreationStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = Member;
