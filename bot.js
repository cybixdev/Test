require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Update these with your actual links
const telegramChannel = 'https://t.me/your_channel_here';
const whatsappChannel = 'https://chat.whatsapp.com/your_group_link_here';

// Welcome message
bot.start((ctx) =>
  ctx.reply(
    `👋 Welcome to the Veo3 Video Bot!\n\nGenerate cinematic AI videos using /veo3 <your prompt>.\n\nCheck out our channels:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Telegram Channel', telegramChannel)],
      [Markup.button.url('WhatsApp Channel', whatsappChannel)],
    ])
  )
);

// /veo3 command
bot.command('veo3', async (ctx) => {
  const prompt = ctx.message.text.replace('/veo3', '').trim();
  
  if (!prompt) {
    await ctx.reply('❗ Please provide a prompt after /veo3. Example:\n/veo3 A sunset over the mountains.');
    return;
  }
  
  await ctx.reply('⏳ Generating your video...');
  
  try {
    // YesChat.ai Veo3 API endpoint (public demo, subject to provider limits)
    const apiUrl = 'https://api.yeschat.ai/v3-api/generate-video';
    // No API key required for public demo (as per docs)
    const response = await axios.post(apiUrl, { prompt });
    
    if (response.data && response.data.video_url) {
      await ctx.reply(
        `✅ Your video is ready!\n${response.data.video_url}`,
        Markup.inlineKeyboard([
          [Markup.button.url('Telegram Channel', telegramChannel)],
          [Markup.button.url('WhatsApp Channel', whatsappChannel)],
        ])
      );
    } else {
      throw new Error('No video URL received from API.');
    }
  } catch (err) {
    await ctx.reply(
      `❌ Video generation failed: ${err.response?.data?.error || err.message}\nPlease try again later.`
    );
  }
});

// Fallback for other messages
bot.on('message', (ctx) => {
  ctx.reply('Use /veo3 <prompt> to generate a video, or /start for more info.');
});

// Start bot (Render uses PORT env var)
const port = process.env.PORT || 3000;
bot.launch({ webhook: { port } });
console.log('🚀 Veo3 Telegram Bot is running on port', port);

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));