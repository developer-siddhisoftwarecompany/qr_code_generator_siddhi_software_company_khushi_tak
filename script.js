const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
const target = document.getElementById(tab.dataset.tab);
    if (target) {
      target.classList.add("active");
    }
    });
});

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    // close all
    faqItems.forEach(i => i.classList.remove("active"));

    // open current
    item.classList.add("active");
  });
});

