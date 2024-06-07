const Category = require('../models/category'); // Category 모델이 정의되어 있어야 합니다
const Member = require('../models/member'); // Member 모델이 정의되어 있어야 합니다

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
      const sortBy = req.query.sortBy || 'recentJoin';
      const sortOption = sortOptions[sortBy];
      const userType = req.query.userType;

      const categories = await Category.findAll({
        order: [sortOption],
        include: [{
          model: Member,
          as: 'Member'
        }]
      });

      res.json({ categories }); // JSON 형식으로 응답
    } catch (error) {
      console.log(`Error fetching categories: ${error.message}`);
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
