const SeniorProfile = require('../models/seniorProfile');
const Member = require('../models/member');
const InterestField = require("../models/interestField");
const Review = require("../models/review");
const fs = require('fs').promises;

async function fetchData(userID) {
    try {
        const users = await Member.findOne({ where: { memberNum: userID } });
        return users;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function fetchData2(userID) {
    try {
        const senior = await SeniorProfile.findOne({ where: { seniorNum: userID } });
        return senior;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function interestFieldData(seniorID) {
    try {
        const interests = await InterestField.findAll({
            where: { memberNum: seniorID },
            attributes: ['interestField']
        });

        return interests.map(interest => interest.interestField);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function reviewData(memberNum) {
    try {
        const review = await Review.findAll({ where: { reviewReceiver: memberNum } });
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

exports.createOldProfile = (req, res) => {
    const user = req.session.user;
    res.render("CreateProfile_old.ejs", { user });
};

exports.createSeniorProfile = async (req, res) => {
    try {
        const {
            name,
            birthYear,
            phoneNumber,
            gender,
            sido,
            gugun,
            favoField,
            desiredAmount,
            ableDay,
            ableTime,
            selfIntro,
            caution,
            active
        } = req.body;

        const formatSelfIntro = selfIntro ? selfIntro.replace(/\r\n/g, "<br>") : '';
        const formatCaution = caution ? caution.replace(/\r\n/g, "<br>") : '';

        const profileImagePath = req.file ? req.file.path : null;
        let profileImage = null;

        if (profileImagePath) {
            profileImage = await fs.readFile(profileImagePath);
        }

        const ableDayMapping = {
            'ableDay_1': '월',
            'ableDay_2': '화',
            'ableDay_3': '수',
            'ableDay_4': '목',
            'ableDay_5': '금',
            'ableDay_6': '토',
            'ableDay_7': '일'
        };

        const ableTimeMapping = {
            'ableTime_noon': '오후',
            'ableTime_morn': '오전',
            'ableTime_disscu': '협의'
        };

        const desireMapping = {
            'DA_1': '1만원',
            'DA_3': '3만원',
            'DA_5': '5만원',
            'DA_free': '무료',
            'DA_disscu': '협의'
        };

        const seniorProfile = await SeniorProfile.create({
            seniorNum: req.session.user.memberNum,
            profileImage,
            desiredAmount: desireMapping[desiredAmount],
            enableMatching: active === '활성화',
            gender: gender === 'female' ? '여성' : '남성',
            precautions: formatCaution,
            introduce: formatSelfIntro,
            seniorName: name,
            seniorPhoneNumber: phoneNumber,
            matchingCount: 0,
            creationTime: new Date(),
            recentMatchingTime: null,
            yearOfBirth: birthYear,
            sido,
            gu: gugun,
            availableDay: ableDay ? ableDayMapping[ableDay] : null,
            availableTime: ableTime ? ableTimeMapping[ableTime] : null,
            score: 0
        });

        const fieldMappings = {
            'FF_exercise': '운동',
            'FF_craft': '수공예',
            'FF_digital': '디지털',
            'FF_music': '음악',
            'FF_art': '미술',
            'FF_companion': '말동무'
        };

        if (favoField) {
            for (const field of Array.isArray(favoField) ? favoField : [favoField]) {
                const mappedField = fieldMappings[field];
                if (mappedField) {
                    await InterestField.create({
                        memberNum: req.session.user.memberNum,
                        interestField: mappedField
                    });
                }
            }
        }

        await Member.update({ profileCreationStatus: true }, { where: { memberNum: req.session.user.memberNum } });

        res.redirect('/main');
    } catch (error) {
        console.error("Error creating senior profile:", error);
        res.status(500).send("프로필을 생성하는 중에 오류가 발생했습니다.");
    }
};

exports.modifiedSeniorProfile = async (req, res) => {
    try {
        const user = req.session.user;
        const senior = await fetchData2(req.session.userID);

        if (senior) {
            const year = calculateKoreanAgeByYear(senior.yearOfBirth);
            const interestField = await interestFieldData(senior.seniorNum);
            const review = await reviewData(senior.seniorNum);
            const encodedImageBase64String = Buffer.from(senior.profileImage).toString('base64');
            res.render('modifiedProfile_old', { senior, age: year, encodedImageBase64String, interests: interestField, review, user });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateSeniorProfile = async (req, res) => {
    try {
        const {
            name,
            birthYear,
            phoneNumber,
            gender,
            sido,
            gugun,
            favoField,
            desiredAmount,
            ableDay,
            ableTime,
            selfIntro,
            caution
        } = req.body;

        const formatSelfIntro = selfIntro.replace(/\r\n/g, "<br>");
        const formatCaution = caution.replace(/\r\n/g, "<br>");

        const profileImagePath = req.file ? req.file.path : null;
        let profileImage = null;

        if (profileImagePath) {
            profileImage = await fs.readFile(profileImagePath);
        }

        const seniorProfile = await SeniorProfile.findOne({ where: { seniorNum: req.session.userID } });

        if (!seniorProfile) {
            return res.status(404).json({ error: "Senior profile not found" });
        }

        const matchingCount = seniorProfile.matchingCount;

        await seniorProfile.destroy();

        const ableDayString = Array.isArray(ableDay) ? ableDay.join(',') : ableDay;

        const ableDayMapping = {
            'ableDay_1': '월',
            'ableDay_2': '화',
            'ableDay_3': '수',
            'ableDay_4': '목',
            'ableDay_5': '금',
            'ableDay_6': '토',
            'ableDay_7': '일'
        };

        const ableTimeMapping = {
            'ableTime_noon': '오후',
            'ableTime_morn': '오전',
            'ableTime_disscu': '협의'
        };

        const desireMapping = {
            'DA_1': '1만원',
            'DA_3': '3만원',
            'DA_5': '5만원',
            'DA_free': '무료',
            'DA_disscu': '협의'
        };

        const newSeniorProfile = await SeniorProfile.create({
            seniorNum: req.session.user.memberNum,
            profileImage,
            desiredAmount: desireMapping[desiredAmount],
            enableMatching: active === '활성화',
            gender: gender === 'male' ? '남성' : '여성',
            precautions: formatCaution,
            introduce: formatSelfIntro,
            seniorName: name,
            seniorPhoneNumber: phoneNumber,
            matchingCount,
            creationTime: new Date(),
            recentMatchingTime: null,
            yearOfBirth: birthYear,
            sido,
            gu: gugun,
            availableDay: ableDayMapping[ableDayString],
            availableTime: ableTimeMapping[ableTime],
            score: 0,
            recentMatchingTime: null
        });

        const fieldMappings = {
            'FF_exercise': '운동',
            'FF_craft': '수공예',
            'FF_digital': '디지털',
            'FF_music': '음악',
            'FF_art': '미술',
            'FF_companion': '말동무'
        };

        for (const field of favoField) {
            const mappedField = fieldMappings[field];
            if (mappedField) {
                await InterestField.create({
                    memberNum: req.session.userID,
                    interestField: mappedField
                });
            }
        }

        const user = await fetchData(req.session.userID);
        if (user) {
            await Member.update({ profileCreationStatus: true }, { where: { memberNum: req.session.userID } });
        }

        res.redirect('/main');
    } catch (error) {
        console.error("Error updating senior profile:", error);
        res.status(500).send("프로필을 업데이트하는 중에 오류가 발생했습니다.");
    }
};
