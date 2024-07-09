const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./module/passport');

dotenv.config();
const userRouter = require('./routes/user');

const app = express();
app.set('port', process.env.PORT);

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
passportConfig();

app.use('/user', userRouter);

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
