const bcrypt = require('bcrypt');
const connectDB = require('../database/database');
const passport = require('passport');
const {
  Strategy: JWTStrategy,
  ExtractJwt: ExtractJWT,
} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

let db = connectDB
  .then((client) => {
    console.log('MONGODB 연결 성공');
    db = client.db('hanwha');
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = () => {
  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        const user = await db.collection('user').findOne({ email: email });

        if (!user) {
          return done(null, false, { message: '존재하지 않는 계정입니다.' });
        }

        if (await bcrypt.compare(password, user.password)) {
          return done(null, user, { message: '로그인에 성공하였습니다.' });
        } else {
          return done(null, false, {
            message: '비밀번호가 일치하지 않습니다.',
          });
        }
      }
    )
  );
};
