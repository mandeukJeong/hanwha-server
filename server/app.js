const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./module/passport');
const connectDB = require('./database/database');
const cookie = require('cookie');
const { ObjectId } = require('mongodb');

const userRouter = require('./routes/user');
const playerRouter = require('./routes/players');
const chatRouter = require('./routes/chat');
const galleryRouter = require('./routes/gallery');

const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
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
    socket.join(roomId);
  });

  socket.on('message-send', async (data) => {
    const cookies = socket.request.headers.cookie;
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
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
  });
});

server.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
