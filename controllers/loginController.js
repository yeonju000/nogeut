const Member = require('../models/member');
const Sequelize = require('sequelize');

async function fetchData(userID) {
    try {
        const users = await Member.findOne({ where: { memberID: userID } });
        return users; // fetchData 함수가 Promise를 반환하도록 수정
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function insertData() {
    try {
        await Member.create({
            memberID: 'final',
            memberPW: 'final',
            name: '종강어머니송강호',
            age: 614,
            profileCreationStatus: false
        });
    } catch (error) {
        console.error(error);
        throw error; // 에러를 호출자에게 전파
    }
}

exports.connect = async (req, res) => {
    res.render("mainHome", {user:null}); // 로그인 성공 시    
};

exports.login = async (req, res) => {
    res.render("mainLogin",{err:null});
}

exports.postLogin = async (req, res) => {
	const { userID, password } = req.body;
	console.log(userID, password);
    try {
        //await insertData();
        const user = await fetchData(userID); // fetchData 함수 호출
        if (user) {
            if (user.memberPW === password) {
                req.session.userID = user.memberNum;
                if(user.profileCreationStatus) {
                    res.redirect('/main'); //로그인 완료후 프로필을 생성한 사람
                }else{
                    res.redirect('/Creation')
                }
            } else {
                res.render("mainLogin", { error: "비밀번호가 틀렸습니다." }); // 비밀번호 틀림
            }
        } else {
            res.render("mainLogin", { error: "사용자를 찾을 수 없습니다." }); // 사용자 없음
        }
    } catch (error) {
        console.error(error);
        res.render("mainLogin", { error: "오류가 발생했습니다." }); // 일반 오류
    }
};

// insertData 함수는 필요에 따라 호출하도록 수정
// insertData();

// fetchData 함수는 login 함수 내에서 호출되므로 주석 처리
// const user = fetchData();
// console.log(user);
