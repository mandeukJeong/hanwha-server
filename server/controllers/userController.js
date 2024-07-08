const userService = require('../services/userService');

module.exports = {
  registerUser: async (req, res) => {
    // email, nickname, password 미입력
    if (!req.body.email || !req.body.nickname || !req.body.password) {
      return res.status(400).json({
        message:
          'Invalid request body. Must include email, nickname and password',
      });
    }
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
};
