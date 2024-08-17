require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

bot.on("message:text", async (ctx) => {
  // Text is always present because this handler is called when a text message is received.
  try {
    const prompt = ctx.msg.text;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
              role: "user",
              content: "Write a haiku about recursion in programming.",
          },
      ],
  });
    ctx.reply(completion.choices[0].message);
  } catch (error) {
    ctx.reply(error)
  };
});
