const { User } = require("../models/User");

let auth = (req, res, next) => {
    //인증 처리
    //client cookie token 가져오기
    let token = req.cookies.x_auth;

    //토큰 복호화 & user 찾기
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true});

        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = {auth};