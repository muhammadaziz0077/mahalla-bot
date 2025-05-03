const TelegramBot = require('node-telegram-bot-api');

// 👉 Bot tokeningizni shu yerga yozing
const token = '8116183863:AAETGhO9ChHXeSgFajwOhD7Aijua574xMec';
const bot = new TelegramBot(token, { polling: true });

const PASSWORD = '7687';
const authorizedUsers = {}; // { user_id: true }
const groupChats = new Set();

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Guruhga qo‘shilgan bo‘lsa va admin bo‘lsa
  if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
    groupChats.add(chatId);
    return;
  }

  const text = msg.text;

  // Start komandasi
  if (text === '/start') {
    if (!authorizedUsers[msg.from.id]) {
      bot.sendMessage(chatId, 'Parolni kiriting:');
    } else {
      sendAdminPanel(chatId);
    }
    return;
  }

  // Parol tekshiruvi
  if (!authorizedUsers[msg.from.id]) {
    if (text === PASSWORD) {
      authorizedUsers[msg.from.id] = true;
      bot.sendMessage(chatId, 'Admin panelga xush kelibsiz!');
      sendAdminPanel(chatId);
    } else {
      bot.sendMessage(chatId, 'Noto‘g‘ri parol. Qaytadan urinib ko‘ring.');
    }
    return;
  }

  // Xabar yuborish rejimi
  if (text === '📢 Barchaga xabar yuborish') {
    bot.sendMessage(chatId, 'Yubormoqchi bo‘lgan xabaringizni kiriting:');
    bot.once('message', (msg2) => {
      const messageToSend = msg2.text;

      groupChats.forEach((groupId) => {
        bot.sendMessage(groupId, messageToSend);
      });

      bot.sendMessage(chatId, 'Xabar barcha guruhlarga yuborildi.');
    });
  }
});

// Admin panel menyusi
function sendAdminPanel(chatId) {
  bot.sendMessage(chatId, 'Admin panel:', {
    reply_markup: {
      keyboard: [['📢 Barchaga xabar yuborish']],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
}
