import { EXAM_EVENTS, GET_USER_ANSWER_ERRORS, QUESTION_TYPES } from "../../config/config";
import Exam from "../LogicClasses/Exam";
import Timer from "../LogicClasses/Timer";
import timeFormat from "../utils/timeFormat";
import QuestionUIFactory from "./Question";
import Question from "./Question";
import Result from "./Result";

class ExamComponent {
  constructor(mainElements) {
    this.mainElements = mainElements;
    this.timer = new Timer({
      timerElement: this.mainElements.timerElement
    });
    this.questionUIFactory = new QuestionUIFactory();
    this.getAnswerHandlers = {};
    this.callbackHandlers = {};
    this.initializeGetAnswerHandlers();
    this.initializeSectionState();
    this.addEventListeners();

  };
  
  initializeGetAnswerHandlers = () => {
    this.setGetAnswerHandler({ 
      questionType: QUESTION_TYPES.multipleChoice, 
      getAnswerHandler: this.getMultipleChoiceQuestionAnswer
    });
    this.setGetAnswerHandler({
      questionType: QUESTION_TYPES.text, 
      getAnswerHandler: this.getTextQuestionAnswer
    });
  }

  getNewExam = () => {
    const exam = new Exam();
    return exam;
  }

  withQuestionUIFactory = (questionUIFactory) => {
    if (questionUIFactory) {
      this.questionUIFactory = questionUIFactory;
    }
  }

  setGetAnswerHandler = ({ questionType, getAnswerHandler }) => {
    this.getAnswerHandlers[questionType] = getAnswerHandler;
  }

  setCallbackHandler = ({ examEvent, callback }) => {
    this.callbackHandlers[examEvent] = callback;
  }

  initializeSectionState = () => {
    this.toggleSectionState({
      isDoingExam:true
    });
    this.mainElements.examContainer.style.display = "none";
    this.mainElements.timerElement.innerText = '00:00:00';
  };

  addEventListeners = () => {
    this.mainElements.timerElement.onclick =  () => {
      this.startExam();
      if (this.callbackHandlers[EXAM_EVENTS.clickTimer]) {
        this.callbackHandlers[EXAM_EVENTS.clickTimer]();
      }
    };
    this.mainElements.nextButton.onclick =  () => this.handleClickNavigateButton({
      isNextButton: true
    });
    this.mainElements.backButton.onclick =  () => this.handleClickNavigateButton({
      isNextButton: false
    });
    this.mainElements.retestButton.onclick =  () => {
      this.startExam();
      if (this.callbackHandlers[EXAM_EVENTS.clickRetestButton]) {
        this.callbackHandlers[EXAM_EVENTS.clickRetestButton]();
      }
    };
    this.mainElements.homeButton.onclick =  () => {
      this.initializeSectionState();
      if (this.callbackHandlers[EXAM_EVENTS.clickHomeButton]){
        this.callbackHandlers[EXAM_EVENTS.clickHomeButton]();
      }
    };
  };

  handleClickNavigateButton = ({
    isNextButton
  }) => {
    try {
      const userAnswer = this.getUserAnswer();
      this.exam.setUserAnswer(userAnswer);
      if (isNextButton && !this.exam.hasNextQuestion()) {
        this.handleSubmit();
      } else {
        this.showQuestion({
          isGettingNextQuestion: isNextButton
        });
      };
      if (this.callbackHandlers[EXAM_EVENTS.clickNavigateButton]) {
        this.callbackHandlers[EXAM_EVENTS.clickNavigateButton]();
      }
    } catch (error) {
      console.error(error)
    }
  }

  getTextQuestionAnswer = () => {
    const textInputElement = document.querySelector('input[name="answer"]');
    if (textInputElement) {
      return textInputElement.value;
    };
    return ''
  }

  getMultipleChoiceQuestionAnswer = () => {
    const choiceCheckboxes = document.querySelectorAll('input[name="choice"]');
    for (let choiceCheckbox of choiceCheckboxes) {
      if (choiceCheckbox.checked) {
        return choiceCheckbox.value;
      }
    }
    return '';
  }

  getUserAnswer = () => {
    const currentQuestion = this.exam.getCurrentQuestion();
    console.log(this.getAnswerHandlers, currentQuestion.type)
    if (this.getAnswerHandlers[currentQuestion.type]) {
      try {
        return this.getAnswerHandlers[currentQuestion.type]();
      } catch (error) {
        throw Error(GET_USER_ANSWER_ERRORS.CannotGetUserAnswer);
      }
    } else {
      throw Error(GET_USER_ANSWER_ERRORS.NotExistingType);
    }
  }

  handleSubmit = () => {
    this.timer.end();
  };
  
  changeToExamState = () => {
    // Show element of exam section
    this.mainElements.examContainer.style.display = 'block';
    this.mainElements.questionContainer.style.display = 'block';
    this.mainElements.timerElement.style.display = 'block';
    // Hide element of result section
    this.mainElements.retestButton.style.display = 'none';
    this.mainElements.homeButton.style.display = 'none';
    this.mainElements.resultContainer.innerHTML = '';
  }

  changeToResultState = () => {
    // Show element of result section
    this.mainElements.retestButton.style.display = 'block';
    this.mainElements.homeButton.style.display = 'block';
    // Hide element of exam section
    this.mainElements.timerElement.style.display = 'none';
    this.mainElements.questionContainer.style.display = 'none';
    this.mainElements.examContainer.style.display = 'none';
  }

  toggleSectionState = ({
    isDoingExam
  }) => {
    if (isDoingExam) {
      this.changeToExamState();
    } else {
      this.changeToResultState();
    }
  };


  startExam = () => {
    this.exam = this.getNewExam();
    this.exam.loadRandomExam().then(() => {
      this.mainElements.examContainer.querySelector("h3.exam-exp").innerHTML = 
      `Expired in <strong>${timeFormat(this.exam.getExpiredTime())}</strong>`;
    
      this.timer.reset({
        timeoutInSecond: this.exam.getExpiredTime(),
        onEnd: this.showResult
      });
      this.timer.start();
      this.showQuestion({
        isGettingNextQuestion: true
      });
      this.toggleSectionState({
        isDoingExam: true
      });
    }).catch((error) => {
      console.error(error);
    });
  };

  // Show mark & compare user's answer vs ground truth
  showResult = () => {
    const results = this.exam.getResults();
    // Render HTML based on the results 
    this.mainElements.resultContainer.innerHTML = Result({
      results, 
      timeDoneInSecond: this.exam.getExpiredTime() - this.timer.getCurrentTimeout()
    });
    this.toggleSectionState({
      isDoingExam: false
    });
  };

  getQuestion = ({
    isGettingNextQuestion
  }) => {
    return isGettingNextQuestion 
    ? this.exam.getNextQuestion() 
    : this.exam.getPreviousQuestion();
  }

  renderQuestion = ({
    question,
    userAnswer
  }) => {
    this.mainElements.questionContainer.innerHTML = this.questionUIFactory.renderQuestion({
      question,
      userAnswer
    });
  }

  showQuestion = ({
    isGettingNextQuestion
  }) => {
    const { question, userAnswer } = this.getQuestion({ isGettingNextQuestion });
    if (question) {
      try {
        this.renderQuestion({ question, userAnswer });
        this.changeStateOfNavigateButton();
      } catch (error) {
        console.error(error);
      }
    };
  };

  changeStateOfNavigateButton = () => {
    this.mainElements.backButton.disabled = !this.exam.hasPreviousQuestion();
    if (!this.exam.hasNextQuestion()) {
      this.mainElements.nextButton.innerText = 'Submit';
    } else {
      this.mainElements.nextButton.innerText = 'Next';
    }
  };
}

export default ExamComponent;