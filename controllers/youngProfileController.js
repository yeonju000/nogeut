const StudentProfile = require('../models/studentProfile');
const Member = require('../models/member');
const Sequelize = require('sequelize');
const InterestField = require("../models/interestField");
const fs = require('fs').promises;
const Review = require("../models/review");

async function fetchData(userID) {
    try {
        const users = await Member.findOne({ where: { memberNum: userID } });
        return users;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function fetchData3(userID) {
    try {
        const student = await StudentProfile.findOne({ where: { stdNum: userID } });
        return student;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function interestFieldData(userID) {
    try {
        const interests = await InterestField.findAll({ where: { memberNum: userID } });
        if (interests.length > 0) {
            console.log("등록된 관심 분야가 있습니다.");
        } else {
            console.log("등록된 관심 분야가 없습니다.");
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
            console.log("등록된 후기가 있습니다.");
        } else {
            console.log("등록된 후기가 없습니다.");
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

exports.createYoungProfile = (req, res) => {
    const user = req.session.user;
    res.render("CreateProfile_young", { user: user });
};

exports.createStudentProfile = async (req, res) => {
    try {
        const {
            birthYear,
            phoneNumber,
            gender,
            university,
            major,
            sido,
            gugun,
            favoField,
            desiredAmount,
            ableDay,
            ableTime,
            selfIntro,
            active
        } = req.body;

        const formatSelfIntro = selfIntro.replace(/\r\n/g, "<br>");
        const profileImagePath = req.file ? req.file.path : null;
        let profileImage = null;

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

        const studentProfile = await StudentProfile.create({
            stdNum: req.session.user.memberNum,
            profileImage: profileImage,
            yearOfBirth: birthYear,
            phoneNumber: phoneNumber,
            gender: gender === 'male' ? '남성' : '여성',
            university: university,
            major: major,
            sido: sido,
            gu: gugun,
            desiredAmount: DesireMapping[desiredAmount],
            availableDay: ableDayMapping[ableDayString],
            availableTime: ableTimeMapping[ableTime],
            introduce: formatSelfIntro,
            enableMatching: active === '활성화',
            matchingCount: 0,
            score: 0,
            creationTime: new Date(),
            recentMatchingTime: null
        });

        const favoFields = Array.isArray(favoField) ? favoField : [favoField];
        
        const fieldMappings = {
            'FF_exercise': '운동',
            'FF_craft': '수공예',
            'FF_digital': '디지털',
            'FF_music': '음악',
            'FF_art': '미술',
            'FF_companion': '말동무'
        };

        for (const field of favoFields) {
            const mappedField = fieldMappings[field];
            if (mappedField) {
                await InterestField.create({
                    memberNum: req.session.user.memberNum,
                    interestField: mappedField
                });
            }
        }

        await Member.update({ profileCreationStatus: true }, { where: { memberNum: req.session.user.memberNum } });
        res.redirect('/main');
    } catch (error) {
        console.error("Error creating Student profile:", error);
        res.status(500).send("프로필을 생성하는 중에 오류가 발생했습니다.");
    }
};

exports.modifiedStudentProfile = async (req, res) => {
    try {
        const user = req.session.user;
        const student = await fetchData3(req.session.user.memberNum);

        if (student) {
            const year = await calculateKoreanAgeByYear(student.yearOfBirth);
            const interestField = await interestFieldData(student.stdNum);
            const review = await reviewData(student.stdNum);
            const encodedImageBase64String = Buffer.from(student.profileImage).toString('base64');
            res.render('modifiedProfile_young', { student, age: year, encodedImageBase64String: encodedImageBase64String, interests: interestField, review: review, user: user });
        }
        console.log("학생 프로필 수정 페이지를 불러옵니다.")
    } catch (error) {
        console.error("Error loading modified Profile Page:", error);
        res.status(500).send("프로필 수정 페이지를 불러오는 중에 오류가 발생했습니다.");
    }
};

exports.updateStudentProfile = async (req, res) => {
    try {
        const student = await StudentProfile.findOne({ where: { stdNum: req.session.user.memberNum } });
        if (student) {
            const {
                phoneNumber,
                university,
                major,
                sido,
                gugun,
                favoField,
                desiredAmount,
                ableDay,
                ableTime,
                selfIntro,
                active
            } = req.body;

            console.log("---------------------------");
            console.log(req.body);
            console.log("---------------------------");

            const updatedProfile = {
                phoneNumber,
                university,
                major,
                sido,
                gu: gugun,
                desiredAmount,
                availableDay: ableDay,
                availableTime: ableTime,
                introduce: selfIntro,
                enableMatching: active === '활성화'
            };

            await StudentProfile.update(updatedProfile, {
                where: { stdNum: req.session.user.memberNum }
            });

            await InterestField.destroy({ where: { memberNum: req.session.user.memberNum } });

            const favoFields = Array.isArray(favoField) ? favoField : [favoField];
            const fieldMappings = {
                'FF_exercise': '운동',
                'FF_craft': '수공예',
                'FF_digital': '디지털',
                'FF_music': '음악',
                'FF_art': '미술',
                'FF_companion': '말동무'
            };

            for (const field of favoFields) {
                const mappedField = fieldMappings[field];
                if (mappedField) {
                    await InterestField.create({
                        memberNum: req.session.user.memberNum,
                        interestField: mappedField
                    });
                }
            }

            res.redirect('/Detail');
        } else {
            res.status(404).send('학생 프로필을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('프로필을 업데이트하는 중에 오류가 발생했습니다:', error);
        res.status(500).send('프로필을 업데이트하는 중에 오류가 발생했습니다.');
    }
};


       
