const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf("API");

bot.start((ctx) => {
  ctx.reply("Welcome to the Freelance Ethio job scraper!");
});

bot.command("jobs", async (ctx) => {
  try {
    const channel = "freelance_ethio";
    const response = await axios.get(
      `https://api.telegram.org/bot${bot.token}/getChatHistory`,
      {
        params: {
          chat_id: `@${channel}`,
          limit: 100, // Adjust the limit if needed
        },
      }
    );

    const jobKeywords = [
      "software development",
      "website design",
      "website development",
      "wordpress",
      "javascript",
      "laravel",
    ];
    const jobs = response.data.result.messages
      .map((message) => message.text)
      .filter((text) =>
        jobKeywords.some((keyword) => text.toLowerCase().includes(keyword))
      );

    if (jobs.length > 0) {
      ctx.reply(`Found ${jobs.length} job(s) matching your criteria:`);
      ctx.reply(jobs.join("\n\n"));
    } else {
      ctx.reply("No jobs found.");
    }
  } catch (error) {
    console.error(error);
    ctx.reply("An error occurred while fetching jobs. Please try again later.");
  }
});

bot.launch();
