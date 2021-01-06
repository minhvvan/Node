const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User } = require("./models/User")
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser())
const config = require('./config/key')

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {
    //회원 가입 관련 정보 clinet --> db
    const user = new User(req.body)
    console.log(req.body)

    //user모델에 저장
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    })

})

app.post('/login', (req, res) => {
    //요청된 이메일을 DB에서 찾는다
    User.findOne({ email: req.body.email }, (err, user)=> {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "email이 일치하는 유저가 없습니다."
            })
        }
    
        //비밀번호 일치 여부 확인
        user.comparePassword(req.body.password, (err, isMatch) =>{
            if(!isMatch)
                return res.json({loginSuccess: false, message: "비밀번호 불일치"})

            //Token생성
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err)
                
                //토큰을 저장(쿠기, 로컬, etc)
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

