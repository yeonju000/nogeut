const { Op } = require("sequelize");
const Member = require("../models/member");
const SeniorProfile = require("../models/seniorProfile");
const StudentProfile = require("../models/studentProfile");

const sortOptions = {
  rating: ["score", "DESC"],
  matchingCount: ["matchingCount", "DESC"],
  recentMatching: ["recentMatchingTime", "DESC"],
  recentJoin: ["creationTime", "DESC"],
  lowPrice: ["desiredAmount", "ASC"],
  highPrice: ["desiredAmount", "DESC"]
};

module.exports = {
  renderFilter: async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.redirect("/login");
      }

      const user = await Member.findByPk(req.user.memberNum);

      if (!user.profileCreationStatus) {
        return res.redirect("/creation");
      }

      const seniorProfile = await SeniorProfile.findOne({ where: { seniorNum: user.memberNum } });
      const studentProfile = await StudentProfile.findOne({ where: { stdNum: user.memberNum } });

      res.render("filter", {
        isSenior: !!seniorProfile,
        isStudent: !!studentProfile,
        currentUser: user
      });
    } catch (error) {
      console.log(`Error rendering filter: ${error.message}`);
      next(error);
    }
  },

  filterProfiles: async (req, res, next) => {
    try {
      const { region, city, gender, amount, day, time, sortBy } = req.body;
      const order = sortOptions[sortBy] || sortOptions.rating;
      const filterConditions = {};

      if (region) filterConditions.sido = region;
      if (city) filterConditions.gu = city;
      if (gender && gender !== "전체") filterConditions.gender = gender === "남성" ? "남성" : "여성";
      if (amount) filterConditions.desiredAmount = amount;
      if (day) filterConditions.availableDay = day;
      if (time) filterConditions.availableTime = time;

      const user = await Member.findByPk(req.user.memberNum);
      const seniorProfile = await SeniorProfile.findOne({ where: { seniorNum: user.memberNum } });
      const studentProfile = await StudentProfile.findOne({ where: { stdNum: user.memberNum } });

      let profiles = [];
      let isSenior = false;
      let isStudent = false;

      if (seniorProfile) {
        profiles = await StudentProfile.findAll({
          where: filterConditions,
          include: [{ model: Member, attributes: ["name"] }],
          order: [order]
        });
        isSenior = true;
      } else if (studentProfile) {
        profiles = await SeniorProfile.findAll({
          where: filterConditions,
          include: [{ model: Member, attributes: ["name"] }],
          order: [order]
        });
        isStudent = true;
      } else {
        return res.redirect("/main");
      }

      res.render("category", {
        categories: profiles,
        isSenior,
        isStudent,
        sortBy
      });
    } catch (error) {
      console.log(`Error filtering profiles: ${error.message}`);
      next(error);
    }
  }
};
