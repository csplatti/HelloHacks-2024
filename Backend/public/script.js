let title = document.querySelector(".input_one");
let description = document.querySelector(".input_three");
let essay = document.querySelector(".input_five");
let submit = document.getElementById("submit");

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
// console.log(checkboxes);
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    console.log(checkbox.value);
  });
});

// submit.addEventListener("click", () => {
//   console.log(title.value);
//   console.log(description.value);
//   console.log(essay.value);
// });

submit.addEventListener("click", whenSubmitEssay);

const baseUrl = "http://localhost:8080/";
async function whenSubmitEssay(e) {
  let criteria = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      criteria.push(checkbox.value);
    }
  });
  console.log(criteria);
  console.log(essay.value);
  e.preventDefault();
  if (essay.value == "") {
    return;
  }
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: {
        essay: encodeURIComponent(essay.value),
        criteria: encodeURIComponent(description.value),
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.feedback);
      //document.getElementById("response_container").innerHTML = data.feedback;
      return data.feedback;
    })
    .catch((error) => {
      console.error("Error: ", error);
    });

  const radioButtons = document.querySelectorAll('input[type="radio"]:checked');
  radioButtons.forEach((radioButton) => {
    console.log(radioButton.value);
  });
}
