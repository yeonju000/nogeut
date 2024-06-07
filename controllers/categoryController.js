const { Op } = require("sequelize");
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
  index: async (req, res, next) => {
    try {
      const { region, city, gender, amount, day, time, sortBy } = req.query;
      const order = sortOptions[sortBy] || sortOptions.rating;
      const filterConditions = {};

      if (region) filterConditions.sido = region;
      if (city) filterConditions.gu = city;
      if (gender && gender !== "전체") filterConditions.gender = gender === "남성" ? "남성" : "여성";
      if (amount) filterConditions.desiredAmount = { [Op.lte]: amount }; // 원하는 금액 이하로 필터링
      if (day) filterConditions.availableDay = day;
      if (time) filterConditions.availableTime = time;

      console.log('Filter conditions:', filterConditions); // 필터 조건 로그 출력

      let profiles = [];
      const user = req.user; // 로그인된 사용자 정보를 세션에서 가져옴

      if (user.userType === 'student') {
        profiles = await SeniorProfile.findAll({
          where: filterConditions,
          order: [order]
        });
      } else if (user.userType === 'senior') {
        profiles = await StudentProfile.findAll({
          where: filterConditions,
          order: [order]
        });
      } else {
        return res.redirect("/main");
      }

      console.log('Profiles:', profiles); // 필터링된 프로필 로그 출력

      res.render("category", {
        categories: profiles,
        isSenior: user.userType === 'senior',
        isStudent: user.userType === 'student',
        sortBy
      });
    } catch (error) {
      console.log(`Error filtering profiles: ${error.message}`);
      next(error);
    }
  },

  new: (req, res) => {
    res.render('categories/new');
  },

  create: async (req, res, next) => {
    try {
      const category = await Category.create(req.body);
      res.locals.redirect = `/categories/${category.id}`;
      next();
    } catch (error) {
      console.log(`Error creating category: ${error.message}`);
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id);
      res.render('categories/show', { category });
    } catch (error) {
      console.log(`Error fetching category: ${error.message}`);
      next(error);
    }
  },

  showView: (req, res) => {
    res.render('categories/show');
  },

  edit: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id);
      res.render('categories/edit', { category });
    } catch (error) {
      console.log(`Error fetching category: ${error.message}`);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      await Category.update(req.body, {
        where: { id: req.params.id }
      });
      res.locals.redirect = `/categories/${req.params.id}`;
      next();
    } catch (error) {
      console.log(`Error updating category: ${error.message}`);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await Category.destroy({
        where: { id: req.params.id }
      });
      res.locals.redirect = "/categories";
      next();
    } catch (error) {
      console.log(`Error deleting category: ${error.message}`);
      next(error);
    }
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  }
};
