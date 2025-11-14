  // Load header & footer
fetch("../components/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    // Add dark mode listener after header loads
    const toggleBtn = document.getElementById("toggleMode");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        toggleBtn.textContent = document.body.classList.contains("dark-mode")
          ? "☀"
          : "🌙";
      });
    }
  });

fetch("../components/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });