const Message = require('../models/Message');
const User    = require('../models/User');

// Get all conversations for logged-in user
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender',   'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: -1 });

    // Build unique conversation list
    const seen = new Map();
    messages.forEach((msg) => {
      const other = msg.sender._id.toString() === userId.toString()
        ? msg.receiver : msg.sender;
      if (!seen.has(other._id.toString())) {
        seen.set(other._id.toString(), {
          user:       other,
          lastMsg:    msg.content,
          lastTime:   msg.createdAt,
          unread:     !msg.read && msg.receiver._id.toString() === userId.toString(),
        });
      }
    });

    res.json(Array.from(seen.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages between two users
const getMessages = async (req, res) => {
  try {
    const userId  = req.user._id;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: userId,  receiver: otherId },
        { sender: otherId, receiver: userId  },
      ],
    })
      .populate('sender',   'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { sender: otherId, receiver: userId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message (REST fallback)
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = await Message.create({
      sender:   req.user._id,
      receiver: receiverId,
      content,
    });
    const populated = await message.populate('sender receiver', 'name role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage };