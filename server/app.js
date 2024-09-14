const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./module/passport');

const userRouter = require('./routes/user');
const playerRouter = require('./routes/players');
const chatRouter = require('./routes/chat');
const galleryRouter = require('./routes/gallery');

const app = express();
dotenv.config();
app.set('port', process.env.PORT);

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
passportConfig();

app.use('/user', userRouter);
app.use(
  '/players',
  passport.authenticate('jwt', { session: false }),
  playerRouter
);
app.use('/chat', passport.authenticate('jwt', { session: false }), chatRouter);
app.use(
  '/gallery',
  passport.authenticate('jwt', { session: false }),
  galleryRouter
);

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
