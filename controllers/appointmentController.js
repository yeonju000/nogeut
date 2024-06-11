const { format } = require('date-fns');
const Promise = require("../models/promise");
const SeniorProfile = require("../models/seniorProfile");
const StudentProfile = require("../models/studentProfile");
const ChatRoom = require("../models/chatRoom");
const Matching = require("../models/matching");

//학생프로필과 약속
exports.showPage = async (req, res) => {
    try {
        console.log("Rendering appointment page");
        res.render('appointment');
    } catch (error) {
        console.error('Error showing appointment page:', error);
        res.status(500).json({ error: 'An error occurred while loading the page.' });
    }
};
