const SeniorProfile = require("../models/seniorProfile");
const InterestField = require("../models/interestField");
const Member = require("../models/member");
const Review = require("../models/review");


async function fetchData(userID) {
    try {
        const users = await Member.findOne({ where: { memberNum: userID } });
        return users; // fetchData 함수가 Promise를 반환하도록 수정
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function fetchData2(userID) {
    try {
        const senior = await SeniorProfile.findOne({ where: { seniorNum: userID } });
        if (senior) {
            console.log("있다있어!!!!!!!!!!!!!!");
        } else {
            console.log("없어!!!!!!!");
        }
        return senior;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function interestFieldData(seniorID) {
    try {
        const interests = await InterestField.findAll({ where: { memberNum: seniorID } });
        if (interests.length > 0) {
            console.log("있다있어!!!!!!!!!!!!!!");
        } else {
            console.log("없어!!!!!!!");
        }
        return interests;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function reviewData(memberNum) {
    try {
        const review = await Review.findAll({ where: { reviewReceiver: memberNum } });
        if (review.length > 0) {
            console.log("있다있어!!!!!!!!!!!!!!");
        } else {
            console.log("없어!!!!!!!");
        }
        return review;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


function calculateKoreanAgeByYear(birthYear) {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

exports.detail = async (req, res) => {
    try {

        //const user = await fetchData(req.session.userID);
        const user = req.session.user;
        //const senior = await fetchData2(req.session.userID);
        const senior = await fetchData2(req.session.user.memberNum);
        if (senior) {
            const year = await calculateKoreanAgeByYear(senior.yearOfBirth);
            const interestField = await interestFieldData(senior.seniorNum);

            //const formatSelfIntro = senior.introduce.replace("<br>", "\n");
            //const formatCaution = senior.precautions.replace("<br>", "\n");

            const review = await reviewData(senior.seniorNum);
            const encodedImageBase64String = Buffer.from(senior.profileImage).toString('base64');
            res.render('DetailedProfile_old', { senior, age: year, encodedImageBase64String: encodedImageBase64String, interests: interestField, review: review, user: user });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}