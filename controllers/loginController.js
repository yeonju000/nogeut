const Member = require('../models/member');

async function fetchData(userID) {
    try {
        const user = await Member.findOne({ where: { memberID: userID } });
        return user; // fetchData 함수가 Promise를 반환하도록 수정
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function insertData() {
    try {
        await Member.create({
            memberNum: 111,
            memberID: 'galim469',
            memberPW: 'galim4692',
            name: '이가림',
            age: 22,
            profileCreationStatus: true
        });
    } catch (error) {
        console.error(error);
        throw error; // 에러를 호출자에게 전파
    }
}

exports.connect = async (req, res) => {
    res.render("mainLogin", { error: null }); // 로그인 페이지 렌더링
};

exports.login = async (req, res) => {
    const { userID, password } = req.body;
    console.log(`UserID: ${userID}, Password: ${password}`);

    try {
        const user = await fetchData(userID); // fetchData 함수 호출
        if (user) {
            if (user.memberPW === password) {
                // 세션에 사용자 정보 저장
                req.session.memberID = user.memberID;
                req.session.memberNum = user.memberNum;
                res.render("CreateProfile_old"); // 로그인 성공 시
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
