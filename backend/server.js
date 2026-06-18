const express    = require('express');
const dotenv     = require('dotenv');
const cors       = require('cors');
const path       = require('path');
const http       = require('http');
const { Server } = require('socket.io');
const connectDB  = require('./config/db');

dotenv.config();
connectDB();

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173', methods: ['GET', 'POST'] },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/companies',     require('./routes/companyRoutes'));
app.use('/api/jobs',          require('./routes/jobRoutes'));
app.use('/api/applications',  require('./routes/applicationRoutes'));
app.use('/api/messages',      require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/', (req, res) => res.send('JobParking API running'));

// Socket.io — real-time messaging
const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('user_connected', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send_message', async (data) => {
    const { senderId, receiverId, content } = data;
    const Message = require('./models/Message');
    const User    = require('./models/User');

    const message = await Message.create({
      sender: senderId, receiver: receiverId, content,
    });

    const populated = await Message.findById(message._id)
      .populate('sender',   'name role')
      .populate('receiver', 'name role');

    // Send to receiver if online
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', populated);
    }
    // Send back to sender
    socket.emit('receive_message', populated);
  });

  socket.on('disconnect', () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) onlineUsers.delete(userId);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));