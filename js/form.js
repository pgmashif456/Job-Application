  // Select elements
const form = document.querySelector("form");
const steps = document.querySelectorAll(".form-step");
const progress = document.getElementById("progress");
const leadershipField = document.querySelector(".leadership");
let stepIndex = 0;

// Analytics
let analytics = JSON.parse(localStorage.getItem("analytics")) || { started: 0, submitted: 0 };

// Count form start once
if (!localStorage.getItem("started")) {
  analytics.started++;
  localStorage.setItem("started", true);
  localStorage.setItem("analytics", JSON.stringify(analytics));
}

// Load saved form data
if (localStorage.getItem("jobForm")) {
  const saved = JSON.parse(localStorage.getItem("jobForm"));
  Object.entries(saved).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });
}

// Show form step
function showStep(index) {
  steps.forEach((step, i) => step.classList.toggle("active", i === index));
  progress.style.width = `${((index + 1) / steps.length) * 100}%`;
}

// Save form data
function saveForm() {
  const data = {};
  Array.from(form.elements).forEach(el => {
    if (el.name) data[el.name] = el.value;
  });
  localStorage.setItem("jobForm", JSON.stringify(data));
}

// Populate Review Step
function populateReview() {
  const data = JSON.parse(localStorage.getItem("jobForm"));
  document.getElementById("review").innerHTML = `
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Experience:</strong> ${data.experience} years</p>
    ${data.leadership ? `<p><strong>Leadership:</strong> ${data.leadership}</p>` : ""}
    <p><strong>Skills:</strong> ${data.skills}</p>
  `;
}

// Step validation
function validateStep(index) {
  const inputs = steps[index].querySelectorAll("input[required]");

  for (let input of inputs) {
    if (!input.value.trim()) {
      alert("Please fill all required fields.");
      return false;
    }
  }

  // Email validation
  if (form.email && !/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(form.email.value)) {
    alert("Enter a valid email address.");
    return false;
  }

  // Phone validation
  if (form.phone && !/^[0-9]{10}$/.test(form.phone.value)) {
    alert("Enter a valid 10-digit phone number.");
    return false;
  }

  // Resume validation (Step 3)
  if (form.resume && index === 2) {
    const file = form.resume.files[0];
    if (!file) return alert("Please upload a resume.");
    if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type))
      return alert("Upload PDF or DOC only.");
    if (file.size > 2 * 1024 * 1024)
      return alert("File must be under 2MB.");
  }

  return true;
}

// NEXT button
document.querySelectorAll(".next").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!validateStep(stepIndex)) return;

    // Show leadership question only if experience > 5
    leadershipField.classList.toggle("hidden", !(form.experience.value > 5));

    stepIndex = Math.min(stepIndex + 1, steps.length - 1);
    showStep(stepIndex);
    saveForm();

    if (stepIndex === steps.length - 1) populateReview();
  });
});

// PREV button
document.querySelectorAll(".prev").forEach(btn => {
  btn.addEventListener("click", () => {
    stepIndex = Math.max(stepIndex - 1, 0);
    showStep(stepIndex);
  });
});

// SUBMIT FORM
form.addEventListener("submit", e => {
  e.preventDefault();

  analytics.submitted++;
  localStorage.setItem("analytics", JSON.stringify(analytics));
  localStorage.removeItem("jobForm");

  window.location.href = "thankyou.html";
});

// Init
showStep(stepIndex);
