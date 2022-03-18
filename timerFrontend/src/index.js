import ExamComponent from "./js/Components/Main";

window.addEventListener("DOMContentLoaded", () => {
  new ExamComponent({
    timerElement: document.getElementById("timer"),
    questionContainer: document.querySelector(".questions__container"),
    backButton: document.querySelector(".action .back"), 
    nextButton: document.querySelector(".action .next"), 
    resultContainer: document.querySelector(".result__container"),
    examContainer: document.querySelector(".exam__container"),
    retestButton: document.querySelector(".retest-btn"),
    homeButton: document.querySelector(".home-btn")
  })
});