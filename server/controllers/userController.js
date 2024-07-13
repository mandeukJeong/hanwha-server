const dotenv = require('dotenv');
const userService = require('../services/userService');
const passport = require('passport');
const jwt = require('jsonwebtoken');

dotenv.config();

module.exports = {
  registerUser: async (req, res) => {
    try {
      await userService.registerUser(req.body);
      return res.status(201).json({ message: '회원가입에 성공하였습니다.' });
    } catch (e) {
      // 중복된 이메일로 회원가입 요청 시
      if (e.code === 400) {
        return res.status(e.code).json({ error: e.message });
      } else {
        return res.status(500).json({ error: e.message });
      }
    }
  },

  loginUser: async (req, res, next) => {
    try {
      passport.authenticate('local', (error, user, info) => {
        if (error) {
          return res.status(500).json(error);
        }

        if (!user) {
          return res.status(401).json(info.message);
        }

        req.login(user, { session: false }, (err) => {
          if (err) {
            return res.send(err);
          }

          const accessToken = jwt.sign(
            { id: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );
          const refreshToken = jwt.sign(
            { id: user.email },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: '12h' }
          );

          res.cookie('user', user._id, { maxAge: 1000 * 60 * 60 });
          res.cookie('auth', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
          });

          res.status(200).json({
            accessToken,
            email: user.email,
            nickname: user.nickname,
            authId: user.authId,
          });
        });
      })(req, res, next);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  refreshUser: async (req, res) => {
    try {
      passport.authenticate('refresh', (error, user, info) => {
        if (error) {
          return res.status(500).json(error);
        }

        if (!user) {
          return res.status(401).json(info.message);
        }

        req.login(user, { session: false }, (err) => {
          if (err) {
            return res.send(err);
          }

          const accessToken = jwt.sign(
            { id: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );
          const refreshToken = jwt.sign(
            { id: user.email },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: '12h' }
          );

          res.cookie('user', user._id, { maxAge: 1000 * 60 * 60 });
          res.cookie('auth', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
          });

          res.status(200).json({
            accessToken,
            email: user.email,
            nickname: user.nickname,
            authId: user.authId,
          });
        });
      })(req, res);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await userService.getUser(req.cookies.user);
      return res.status(200).json({
        email: user.email,
        nickname: user.nickname,
        authId: user.authId,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('user');
      res.clearCookie('auth');
      res.status(200).json({ message: '로그아웃 성공' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  sendEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const verifyNumber = Math.random().toString().substring(2, 6);
      const emailInfo = {
        toEmail: email,
        subject: '한화 팬페이지 인증번호 발송 메일입니다.',
        text: `${email}님 안녕하세요!\n\n 인증번호: ${verifyNumber}\n\n 인증번호를 화면에 입력해주세요.`,
      };

      await userService.sendEmail(emailInfo, verifyNumber);

      res.status(200).send('이메일 전송 성공');
    } catch (e) {
      if (e.code === 404) {
        return res.status(e.code).json({ error: e.message });
      } else {
        return res.status(500).json({ error: e.message });
      }
    }
  },

  checkAuth: async (req, res) => {
    try {
      await userService.checkAuth(req.body);
      return res.status(200).json({ message: '인증번호가 일치합니다' });
    } catch (e) {
      if (e.code === 404) {
        return res.status(e.code).json({ error: e.message });
      } else {
        return res.status(500).json({ error: e.message });
      }
    }
  },
};
