console.log("hello");

requestParameters = {
  essay: "hello",
  criteria: "formal tone",
};

const baseUrl = "http://localhost:8080";
async function whenSubmitEssay(e) {
  e.preventDefault();
  const res = await fetch(baseUrl, {
    method: "GET",
  });
  console.log(res);
}

document.getElementById("button").addEventListener("click", whenSubmitEssay);
