const dtEls = document.querySelectorAll(".faq-question");

dtEls.forEach((element) => {
  element.addEventListener("click", () => {
    const ddId = element.getAttribute("aria-controls");
    const ddEl = document.getElementById(ddId);
    const arrowIcon = element.querySelector(".arrow-icon");
    if (ddEl.style.display === "none" || ddEl.style.display === "") {
      ddEl.style.display = "block"; 
    } else {
      ddEl.style.display = "none"; 
    }
    arrowIcon.classList.toggle("rotate-180");
  });
});
