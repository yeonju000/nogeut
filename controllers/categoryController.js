const Category = require("../models/category");

module.exports = {
  index: (req, res, next) => {
    Category.findAll()
      .then(categories => {
        res.locals.categories = categories;
        next();
      })
      .catch(error => {
        console.log(`Error fetching categories: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    res.render("category", {
      categories: res.locals.categories
    });
  },

  new: (req, res) => {
    res.render("categories/new");
  },

  create: (req, res, next) => {
    let categoryParams = {
      name: req.body.name,
      description: req.body.description
    };
    Category.create(categoryParams)
      .then(category => {
        res.locals.redirect = "/categories";
        res.locals.category = category;
        next();
      })
      .catch(error => {
        console.log(`Error saving category: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let categoryId = req.params.id;
    Category.findByPk(categoryId)
      .then(category => {
        res.locals.category = category;
        next();
      })
      .catch(error => {
        console.log(`Error fetching category by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("categories/show");
  },

  edit: (req, res, next) => {
    let categoryId = req.params.id;
    Category.findByPk(categoryId)
      .then(category => {
        res.render("categories/edit", {
          category: category
        });
      })
      .catch(error => {
        console.log(`Error fetching category by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let categoryId = req.params.id,
      categoryParams = {
        name: req.body.name,
        description: req.body.description
      };

    Category.update(categoryParams, {
      where: {
        id: categoryId
      }
    })
      .then(() => {
        res.locals.redirect = `/categories/${categoryId}`;
        next();
      })
      .catch(error => {
        console.log(`Error updating category by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let categoryId = req.params.id;
    Category.destroy({
      where: {
        id: categoryId
      }
    })
      .then(() => {
        res.locals.redirect = "/categories";
        next();
      })
      .catch(error => {
        console.log(`Error deleting category by ID: ${error.message}`);
        next(error);
      });
  }
};
