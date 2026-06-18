const express = require('express');
const router  = express.Router();
const { getConversations, getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',              protect, getConversations);
router.get('/:userId',       protect, getMessages);
router.post('/',             protect, sendMessage);

module.exports = router;