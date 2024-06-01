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
  index: async (req, res, next) => {
    try {
      const userType = req.query.userType || 'student'; // 기본값으로 'student'
      const sortBy = req.query.sortBy || "rating";
      const order = sortOptions[sortBy] || sortOptions.rating;

      let profiles;

      if (userType === 'student') {
        profiles = await SeniorProfile.findAll({
          include: [{ model: Member, attributes: ['name'] }],
          order: [order]
        });
      } else {
        profiles = await StudentProfile.findAll({
          include: [{ model: Member, attributes: ['name'] }],
          order: [order]
        });
      }

      res.render("category", {
        categories: profiles,
        userType: userType,
        sortBy: sortBy
      });
    } catch (error) {
      console.log(`Error fetching profiles: ${error.message}`);
      next(error);
    }
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
  },

  getSortedStudents: (req, res, next) => {
    const sortBy = req.query.sortBy || "rating";
    const order = sortOptions[sortBy] || sortOptions.rating;

    StudentProfile.findAll({
      include: [{ model: Member, attributes: ['name'] }],
      order: [order]
    })
      .then(students => {
        res.json({
          categories: students,
          userType: "student"
        });
      })
      .catch(error => {
        console.log(`Error fetching students: ${error.message}`);
        next(error);
      });
  },

  getSortedSeniors: (req, res, next) => {
    const sortBy = req.query.sortBy || "rating";
    const order = sortOptions[sortBy] || sortOptions.rating;

    SeniorProfile.findAll({
      include: [{ model: Member, attributes: ['name'] }],
      order: [order]
    })
      .then(seniors => {
        res.json({
          categories: seniors,
          userType: "senior"
        });
      })
      .catch(error => {
        console.log(`Error fetching seniors: ${error.message}`);
        next(error);
      });
  }
};
