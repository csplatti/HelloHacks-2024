import { feedbackPipeline } from "./GPT Prompting/gpt-prompting.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

//const p = fileURLToPath(import.meta.url);
//const __dirname = p.dirname;

let badEssay = `
William Shakespeare’s play "The Tempest" is, like, totally a wild ride from start to finish. It’s, like, this story about this dude named Prospero who’s, like, stuck on this island with his daughter Miranda, and he’s, like, all bitter because his bro stole his dukedom and left him and Miranda to, like, die at sea. So, Prospero uses his mad magic skills to, like, summon this storm to bring his bro and all these other dudes to the island.

And then there’s all this crazy stuff happening, right? Like, there’s this monster dude Caliban who’s, like, super pissed at Prospero because he took over the island from him. And then there are these two dudes, Stephano and Trinculo, who are, like, trying to take over the island themselves and they get all drunk and stuff with Caliban. It’s, like, a total mess.

But then, there’s this romance thing going on with Miranda and this dude Ferdinand who washes up on shore, and they, like, fall in love instantly and Prospero’s, like, totally freaking out because he’s all protective dad mode, you know?

And, like, the ending is all about forgiveness and stuff. Prospero forgives his bro and lets everyone go back to Italy, and he gives up his magic and goes back to being a duke, which is, like, a total plot twist.

Overall, "The Tempest" is, like, this crazy play with, like, magic and romance and forgiveness and all this other deep stuff. Shakespeare, man, he really knew how to, like, mix it up and keep you guessing. So, yeah, it’s, like, a totally wild ride and stuff.
`;

//feedbackPipeline(badEssay, "formal tone");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

app.use(express.static("public"));
// app.use(express.static("../frontend"));
app.use(express.json());

// app.get("/:dynamic", (req, res) => {
//   const { dynamic } = req.params;
//   const { key } = req.query;
//   console.log(dynamic, key);
//   res.status(200).send(dynamic, key);
// });

app.get("/", (req, res) => {
  //   console.log(path.dirname("page 1/index.html"));
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "index.html"));
  //   res.sendFile(path.join(__dirname, "../frontend/page  1/css"));
});

// app.get("/macbookairone.html", (req, res) => {
//   //   console.log(path.dirname("page 1/index.html"));
//   console.log(__dirname);
//   res.sendFile(path.join(__dirname, "../frontend/page  1/MacBookAirOne.html"));
//   //   res.sendFile(path.join(__dirname, "../frontend/page  1/css/"));
//   //   res.sendFile(path.join(__dirname, "../frontend/page  1/css"));
// });

app.post("/", async (req, res) => {
  const { parcel } = req.body;
  let essay = decodeURIComponent(parcel.essay);
  let criteria = decodeURIComponent(parcel.criteria);
  let description = decodeURIComponent(parcel.description);
  if (!parcel) {
    return res.status(400).send({ status: "failed" });
  }

  const feedback = await feedbackPipeline(essay, description, criteria);

  console.log(feedback);

  //console.log(parcel);
  //   return res.status(200).send({
  //     status: "received",
  //     feedback: feedback /*feedback: feedbackPipeline(essay, criteria)*/,
  //   });
  return res.status(200).send({
    status: "received",
    feedback: feedback /*feedback: feedbackPipeline(essay, criteria)*/,
  });
});

app.listen(port, () => console.log(`Server has started on port ${port}`));
