module.exports = {
  showMainHome: (req, res) => {
    res.render("mainHome");
  },

  showLogin: (req, res) => {
    res.render("login");
  },

  handleLogin: (req, res) => {
    const { userID, password } = req.body;
    // 로그인 인증 로직 추가해야함!!!!!!!!!!
    // 실제 데이터베이스에서 사용자 인증 로직 구현 필요
    if (userID === "user" && password === "pass") {
      req.session.userID = userID; // 세션에 사용자 정보 저장
      res.redirect("/mainHome");
    } else {
      res.render("login", { error: "아이디 또는 비밀번호가 잘못되었습니다." });
    }
  }
};
