const Member = require('../models/member');
const SeniorProfile = require("../models/seniorProfile");
const Sequelize = require('sequelize');

async function fetchData(userID) {
    try {
        const users = await Member.findOne({ where: { memberNum: userID } });
        if(users){
            if(users.name){
                console.log("회원 있다있어!!!!!!!!!!!!!!");
            }
            else{
                console.log("회원 없어!!!!!!!");
            }
        }
        return users;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function fetchData2(userID) {
    try {
        const senior = await SeniorProfile.findOne({ where: { seniorNum: userID } });
        if(senior){
            if(true){
                console.log("있다있어!!!!!!!!!!!!!!");
            }
            else{
                console.log("없어!!!!!!!");
            }
        }
        return senior;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


exports.mainRender = async (req, res) => {
    try {
        const user = await fetchData(req.session.userID);
        res.render('mainHome', { user: user});
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
    
}