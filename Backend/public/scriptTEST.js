console.log("hello");

let badEssay = `
William Shakespeare’s play "The Tempest" is, like, totally a wild ride from start to finish. It’s, like, this story about this dude named Prospero who’s, like, stuck on this island with his daughter Miranda, and he’s, like, all bitter because his bro stole his dukedom and left him and Miranda to, like, die at sea. So, Prospero uses his mad magic skills to, like, summon this storm to bring his bro and all these other dudes to the island.

And then there’s all this crazy stuff happening, right? Like, there’s this monster dude Caliban who’s, like, super pissed at Prospero because he took over the island from him. And then there are these two dudes, Stephano and Trinculo, who are, like, trying to take over the island themselves and they get all drunk and stuff with Caliban. It’s, like, a total mess.

But then, there’s this romance thing going on with Miranda and this dude Ferdinand who washes up on shore, and they, like, fall in love instantly and Prospero’s, like, totally freaking out because he’s all protective dad mode, you know?

And, like, the ending is all about forgiveness and stuff. Prospero forgives his bro and lets everyone go back to Italy, and he gives up his magic and goes back to being a duke, which is, like, a total plot twist.

Overall, "The Tempest" is, like, this crazy play with, like, magic and romance and forgiveness and all this other deep stuff. Shakespeare, man, he really knew how to, like, mix it up and keep you guessing. So, yeah, it’s, like, a totally wild ride and stuff.
`;

let essayInput = document.getElementById("essay_input");

let requestParameters = {
  essay: essayInput.value, //"hello",
  criteria: "formal tone",
};

const baseUrl = "http://localhost:8080/";
async function whenSubmitEssay(e) {
  requestParameters = {
    essay: essayInput.value, //"hello",
    criteria: "formal tone",
  };
  console.log(requestParameters.essay);
  e.preventDefault();
  if (requestParameters.essay == "") {
    return;
  }
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: {
        essay: encodeURIComponent(requestParameters.essay),
        description: "",
        criteria: encodeURIComponent(requestParameters.criteria),
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.feedback);
      document.getElementById("response_container").innerHTML = data.feedback;
      return data.feedback;
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

document.getElementById("button").addEventListener("click", whenSubmitEssay);
