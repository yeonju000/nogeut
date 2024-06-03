module.exports = {
    showMainHome: (req, res) => {
      res.render("mainhome");
    },
  
    showLogin: (req, res) => {
      res.render("login");
    },
  
    handleLogin: (req, res) => {
      const { userID, password } = req.body;
      //로그인 인증 로직 추가해야함!!!!!!!!!!
      if (userID === "user" && password === "pass") {
        res.redirect("/mainhome");
      } else {
        res.render("login", { error: "아이디 또는 비밀번호가 잘못되었습니다." });
      }
    }
  };
  