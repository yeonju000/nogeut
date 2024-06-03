module.exports = {
    showMainHome: (req, res) => {
      res.render("mainhome");
    },
  
    showLogin: (req, res) => {
      res.render("login");
    },
  
    handleLogin: (req, res) => {
      const { userID, password } = req.body;
      // 로그인 인증 로직 추가 (예: DB 조회 및 비밀번호 검증)
      // 여기에 로그인 검증 로직을 추가하십시오.
      // 예를 들어, DB에서 사용자 정보 조회 및 비밀번호 검증 등.
      // 여기서는 간단한 예시로 하드코딩된 값을 사용합니다.
      if (userID === "user" && password === "pass") {
        res.redirect("/mainhome");
      } else {
        res.render("login", { error: "아이디 또는 비밀번호가 잘못되었습니다." });
      }
    }
  };
  