import OpenAI from "openai";
import { api_key } from "./hide-api-key.js";

const openai = new OpenAI({
  apiKey: api_key,
});

async function main() {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Say this is a test" }],
    stream: true,
  });
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

//main();

function getPrompt(essay, criteria) {
  return `
        Your job is to grade english papers written by college students and provide feedback that is requested by them. Refer to the student who wrote the paper in the second person, and provide honest feedback even if it is negative.

        You will be provided the essay and criteria in the back-ticks below:

        Essay: {${essay}}
        Criteria: {${criteria}}

        Your Feedback:
    `;
}

async function getFeedback(prompt) {
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o-mini",
  });
  return response.choices[0].message.content;
  //   const stream = await openai.chat.completions.create({
  //     model: "gpt-4o-mini",
  //     messages: [{ role: "user", content: prompt }],
  //     //stream: true,
  //   });
  //   //   for await (const chunk of stream) {
  //   //     process.stdout.write(chunk.choices[0]?.delta?.content || "");
  //   //   }
  //   return stream;
}

async function feedbackPipeline(essay, criteria) {
  return getFeedback(getPrompt(essay, criteria));
}

// TESTING
let badEssay = `
William Shakespeare’s play "The Tempest" is, like, totally a wild ride from start to finish. It’s, like, this story about this dude named Prospero who’s, like, stuck on this island with his daughter Miranda, and he’s, like, all bitter because his bro stole his dukedom and left him and Miranda to, like, die at sea. So, Prospero uses his mad magic skills to, like, summon this storm to bring his bro and all these other dudes to the island.

And then there’s all this crazy stuff happening, right? Like, there’s this monster dude Caliban who’s, like, super pissed at Prospero because he took over the island from him. And then there are these two dudes, Stephano and Trinculo, who are, like, trying to take over the island themselves and they get all drunk and stuff with Caliban. It’s, like, a total mess.

But then, there’s this romance thing going on with Miranda and this dude Ferdinand who washes up on shore, and they, like, fall in love instantly and Prospero’s, like, totally freaking out because he’s all protective dad mode, you know?

And, like, the ending is all about forgiveness and stuff. Prospero forgives his bro and lets everyone go back to Italy, and he gives up his magic and goes back to being a duke, which is, like, a total plot twist.

Overall, "The Tempest" is, like, this crazy play with, like, magic and romance and forgiveness and all this other deep stuff. Shakespeare, man, he really knew how to, like, mix it up and keep you guessing. So, yeah, it’s, like, a totally wild ride and stuff.
`;

//let out = await feedbackPipeline(badEssay, "formal tone");

//console.log(out);

export { feedbackPipeline };
