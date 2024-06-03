const Member = require("../models/member");
const SeniorProfile = require("../models/seniorProfile");
const StudentProfile = require("../models/studentProfile");
const Keep = require("../models/keep");

module.exports = {
  index: async (req, res, next) => {
    try {
      const sortBy = req.query.sortBy || "newest";
      let order;

      if (sortBy === "newest") {
        order = [["keepTime", "DESC"]];
      } else if (sortBy === "oldest") {
        order = [["keepTime", "ASC"]];
      }

      const keeps = await Keep.findAll({ order: order });
      const profiles = [];

      for (const keep of keeps) {
        let profile = await StudentProfile.findOne({
          where: { stdNum: keep.stdNum },
          include: [{ model: Member, attributes: ['name'] }]
        });

        if (profile) {
          profile.keepTime = keep.keepTime; // Attach the keep time to profile
          profiles.push(profile);
        }
      }

      res.render("keep", {
        categories: profiles,
        sortBy: sortBy
      });
    } catch (error) {
      console.log(`Error fetching keeps: ${error.message}`);
      next(error);
    }
  }
};
