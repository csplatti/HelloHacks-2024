let title = document.querySelector(".input_one");
let description = document.querySelector(".input_three");
let essay = document.querySelector(".input_five");
let submit = document.getElementById("submit");

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
// console.log(checkboxes);
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    // removed console.log to avoid extra console output
  });
});

// Make entire feedback criteria cards toggle their checkbox
function initCardCheckboxes() {
  const cards = document.querySelectorAll(".checkboxesand");
  cards.forEach(card => {
    card.setAttribute("tabindex", "0");
    card.addEventListener("click", (e) => {
      const input = card.querySelector('input[type="checkbox"]');
      if (!input) return;
      // If actual checkbox was clicked, let its own handler work
      if (e.target === input) return;
      input.checked = !input.checked;
      input.classList.toggle("checked", input.checked);
      // removed console.log to avoid extra console output
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        card.click();
      }
    });
  });
}
initCardCheckboxes();

// Auto-resize textarea
const autoResize = (el) => {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 1200) + "px";
};
essay.addEventListener("input", () => autoResize(essay));
autoResize(essay);

// submit.addEventListener("click", () => {
//   console.log(title.value);
//   console.log(description.value);
//   console.log(essay.value);
// });

submit.addEventListener("click", whenSubmitEssay);

const baseUrl = "http://localhost:8080/";

// Enhance markdown render with fade-in
function renderMarkdown(mdText) {
  const container = document.getElementById("response_container");
  if (!container) return;
  container.classList.remove("is-waiting");
  const html = DOMPurify.sanitize(marked.parse(mdText || ""));
  container.innerHTML = html;
  container.classList.add("fade-in");
  setTimeout(() => container.classList.remove("fade-in"), 450);
}

async function whenSubmitEssay(e) {
  e.preventDefault();

  const container = document.getElementById("response_container");
  const draft = essay.value.trim();
  const titleVal = title.value.trim();
  const descVal = description.value.trim();

  // Reset previous error styles
  [title, description, essay].forEach(el => el.classList.remove("input-error"));
  document.querySelectorAll(".label").forEach(l => l.classList.remove("label-error"));

  let missing = [];
  if (!titleVal) {
    title.classList.add("input-error");
    // nearest previous label
    title.parentElement.querySelector(".label")?.classList.add("label-error");
    missing.push("Assignment Title");
  }
  if (!descVal) {
    description.classList.add("input-error");
    description.parentElement.querySelector(".label")?.classList.add("label-error");
    missing.push("Assignment Description");
  }
  if (!draft) {
    essay.classList.add("input-error");
    document.querySelector(".mywork .label")?.classList.add("label-error");
    missing.push("Current Draft");
  }

  // Collect criteria
  let criteria = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) criteria.push(checkbox.value);
  });

  if (missing.length) {
    container.classList.remove("is-waiting");
    container.innerHTML = "Please complete required field(s): " + missing.join(", ") + ".";
    return;
  }

  // Enter loading state
  submit.disabled = true;
  container.classList.add("is-waiting");
  container.innerHTML = "Generating feedback...";

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parcel: {
          essay: encodeURIComponent(draft),
          description: encodeURIComponent(descVal),
          criteria: encodeURIComponent(JSON.stringify(criteria)),
          title: encodeURIComponent(titleVal)
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Server responded with status " + response.status);
    }

    const data = await response.json();
    renderMarkdown(data.feedback || "_No feedback returned._");
  } catch (err) {
    console.error(err);
    container.innerHTML = "An error occurred while generating feedback. Please try again.";
  } finally {
    submit.disabled = false;
    container.classList.remove("is-waiting");
  }

  const radioButtons = document.querySelectorAll('input[type="radio"]:checked');
  radioButtons.forEach((radioButton) => {
    // removed console.log to avoid extra console output
  });
}
