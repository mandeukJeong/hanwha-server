const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./module/passport');
const connectDB = require('./database/database');
const cookie = require('cookie');
const { ObjectId } = require('mongodb');

const apiRouter = express.Router();
const userRouter = require('./routes/user');
const playerRouter = require('./routes/players');
const voteRouter = require('./routes/vote');
const chatRouter = require('./routes/chat');
const galleryRouter = require('./routes/gallery');

const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://hanwha-fan.ap-northeast-2.elasticbeanstalk.com/',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

dotenv.config();
app.set('port', process.env.PORT);

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
passportConfig();

apiRouter.use('/user', userRouter);
apiRouter.use(
  '/players',
  passport.authenticate('jwt', { session: false }),
  playerRouter
);
apiRouter.use(
  '/vote',
  passport.authenticate('jwt', { session: false }),
  voteRouter
);
apiRouter.use(
  '/chat',
  passport.authenticate('jwt', { session: false }),
  chatRouter
);
apiRouter.use('/gallery', galleryRouter);

let db;
connectDB
  .then((client) => {
    console.log('MongoDB 연결 성공');
    db = client.db('hanwha');
  })
  .catch((error) => {
    console.log(error);
  });

io.on('connection', (socket) => {
  socket.on('ask-join', (roomId) => {
    console.log('채팅방에 입장하였습니다.');
    socket.join(roomId);
  });

  socket.on('message-send', async (data) => {
    const cookies = socket.request.headers.cookie;

    if (cookies) {
      const userId = cookieParser.JSONCookies(cookie.parse(cookies)).user;
      const nickname = cookie.parse(cookies).nickname;

      await db.collection('chatMessage').insertOne({
        parentRoom: new ObjectId(data.room),
        content: data.message,
        who: new ObjectId(userId),
        nickname,
        date: new Date(),
      });

      io.to(data.room).emit('message-broadcast', {
        content: data.message,
        who: userId,
        nickname,
      });
    }
  });

  socket.on('leave-room', (roomId) => {
    console.log('채팅방을 떠났습니다.');
    socket.leave(roomId);
    socket.disconnect();
  });
});

server.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});

app.use('/api', apiRouter);
app.use(express.static(path.join(__dirname, './build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
