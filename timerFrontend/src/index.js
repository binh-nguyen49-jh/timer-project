import { QUESTION_TYPES, SECTION_STATES } from "./config/config";
import ExamComponent from "./js/Components/Main";
import { DefaultQuestionResult } from "./js/Components/Result";
import Exam from "./js/LogicClasses/Exam";
import { getMultiSelectAnswer, MultiSelectQuestionUI, MultiSelectQuestion } from "./js/Question";

window.addEventListener("DOMContentLoaded", () => {
  const examComponent = new ExamComponent({
    timerElement: document.getElementById("timer"),
    questionContainer: document.querySelector(".questions__container"),
    backButton: document.querySelector(".action .back"), 
    nextButton: document.querySelector(".action .next"), 
    resultContainer: document.querySelector(".result__container"),
    examContainer: document.querySelector(".exam__container"),
    retestButton: document.querySelector(".retest-btn"),
    homeButton: document.querySelector(".home-btn")
  })

  examComponent.setCallbackHandler({
    examEvent: SECTION_STATES.viewingResult,
    callback: ({ results }) => {
      console.log(results)
    }
  })

  examComponent.getNewExam = () => {
    const exam = new Exam();
    exam.setQuestionTypeMapping({
      questionType: QUESTION_TYPES.multiSelect,
      questionClass: MultiSelectQuestion
    })
    return exam;
  }
  
  examComponent.setGetAnswerHandler({
    questionType: QUESTION_TYPES.multiSelect,
    getAnswerHandler: getMultiSelectAnswer
  })

  examComponent.questionUIFactory.setQuestionTypeMapping({
    questionType: QUESTION_TYPES.multiSelect,
    questionClass: MultiSelectQuestionUI
  })

  examComponent.questionResultUIFactory.setQuestionTypeMapping({
    questionType: QUESTION_TYPES.multiSelect,
    questionClass: DefaultQuestionResult
  })
});