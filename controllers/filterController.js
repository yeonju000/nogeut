const { Op } = require("sequelize");
const Member = require("../models/member");
const SeniorProfile = require("../models/seniorProfile");
const StudentProfile = require("../models/studentProfile");

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
        isStudent: !!studentProfile
      });
    } catch (error) {
      console.log(`Error rendering filter: ${error.message}`);
      next(error);
    }
  },

  filterProfiles: async (req, res, next) => {
    try {
      const { region, city, gender, amount, field, age, day, time } = req.body;
      const filterConditions = {};

      if (region) {
        filterConditions.sido = region;
      }

      if (city) {
        filterConditions.gu = city;
      }

      if (gender) {
        filterConditions.gender = gender === "남" ? "male" : "female";
      }

      if (amount) {
        filterConditions.desiredAmount = amount;
      }

      if (age) {
        const currentYear = new Date().getFullYear();
        const birthYearRange = {
          "20대": [currentYear - 29, currentYear - 20],
          "30대": [currentYear - 39, currentYear - 30],
          "40대": [currentYear - 49, currentYear - 40],
          "50대": [currentYear - 59, currentYear - 50],
          "60대": [currentYear - 69, currentYear - 60],
          "70대": [currentYear - 79, currentYear - 70],
          "80대": [currentYear - 89, currentYear - 80],
          "90대": [currentYear - 99, currentYear - 90],
          "이상": [0, currentYear - 100]
        };
        const [minYear, maxYear] = birthYearRange[age];
        filterConditions.yearOfBirth = { [Op.between]: [minYear, maxYear] };
      }

      if (day) {
        filterConditions.availableDay = day;
      }

      if (time) {
        filterConditions.availableTime = time;
      }

      const user = await Member.findByPk(req.user.memberNum);
      const seniorProfile = await SeniorProfile.findOne({ where: { seniorNum: user.memberNum } });
      const studentProfile = await StudentProfile.findOne({ where: { stdNum: user.memberNum } });

      let profiles = [];

      if (seniorProfile) {
        profiles = await StudentProfile.findAll({
          where: filterConditions,
          include: [{ model: Member, attributes: ["name"] }]
        });
      } else if (studentProfile) {
        profiles = await SeniorProfile.findAll({
          where: filterConditions,
          include: [{ model: Member, attributes: ["name"] }]
        });
      } else {
        return res.redirect("/main"); // 기본 경로로 리디렉션
      }

      res.render("categories", {
        categories: profiles
      });
    } catch (error) {
      console.log(`Error filtering profiles: ${error.message}`);
      next(error);
    }
  }
};
