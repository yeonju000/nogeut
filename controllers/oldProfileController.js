const SeniorProfile = require('../models/seniorProfile');
const Member = require('../models/member');
const Sequelize = require('sequelize');
const InterestField = require("../models/interestField");
const fs = require('fs').promises;


async function fetchData(userID) {
    try {
        const users = await Member.findOne({ where: { memberNum: userID } });
        return users; // fetchData 함수가 Promise를 반환하도록 수정
    } catch (error) {
        console.error(error);
        throw error;
    }
}


exports.detailedOldProfile = (req, res) => {
	res.render("DetailedProfile_old.ejs");
};

exports.createOldProfile = (req, res) => {
	res.render("CreateProfile_old.ejs");
};


exports.postcreateOldProfile = (req, res) => {
	console.log(req.body);
	res.send("프로필이 성공적으로 생성되었습니다.");
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

        const profileImagePath = req.file ? req.file.path : null;
        let profileImage = null;

        // 이미지 파일을 읽어 BLOB 데이터로 변환합니다.
        if (profileImagePath) {
            profileImage = await fs.readFile(profileImagePath);
        }

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

        const DesireMapping = {
            'DA_1': '1만원',
            'DA_3': '3만원',
            'DA_5': '5만원',
            'DA_free': '무료',
            'DA_disscu': '협의'
        };
        const seniorProfile = await SeniorProfile.create({
            seniorNum: req.session.userID,
            profileImage: profileImage,
            desiredAmount: DesireMapping[desiredAmount],
            enableMatching: active === '활성화',
            gender: gender === 'male'? '남성' : '여성',
            precautions: caution,
            introduce: selfIntro,
            seniorName: name,
            seniorPhoneNumber: phoneNumber,
            matchingCount: 0,
            creationTime: new Date(),
            recentMatchingTime: null,
            yearOfBirth: birthYear,
            sido: sido,
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
            await Member.update({
                profileCreationStatus: true
            }, {
                where: { memberNum: req.session.userID }
            }).then((result) => {
                console.log("수정 성공: ", result);
            }).catch((err) => {
                console.log("수정 Error: ", err);
            });
        }

        console.log("Senior profile created:", seniorProfile);
        res.redirect('/main');
    } catch (error) {
        console.error("Error creating senior profile:", error);
        res.status(500).send("프로필을 생성하는 중에 오류가 발생했습니다.");
    }
};
