import { EXAM_EVENTS, GET_USER_ANSWER_ERRORS, QUESTION_TYPES, SECTION_ERRORS, SECTION_STATES } from "../../config/config";
import Exam from "../LogicClasses/Exam";
import SectionState from "../LogicClasses/SectionState";
import Timer from "../LogicClasses/Timer";
import timeFormat from "../utils/timeFormat";
import QuestionUIFactory from "./Question";
import Result from "./Result";

class ExamComponent {
  constructor(mainElements) {
    this.mainElements = mainElements;
    this.timer = new Timer({
      timerElement: this.mainElements.timerElement
    });
    this.questionUIFactory = new QuestionUIFactory();
    this.sectionState = new SectionState();
    this.getAnswerHandlers = {};
    this.callbackHandlers = {};
    this.initializeGetAnswerHandlers();
    this.sectionState.changeSectionState({
      state: SECTION_STATES.initial,
      mainElements
    });
    this.addEventListeners();
  };

  runCallbackFunctionIfExist = (event, args) => {
    if (this.callbackHandlers[event]) {
      this.callbackHandlers[event](args);
    }
  }
  
  setSectionStateHandler = ({
    sectionState,
    handler
  }) => {
    this.sectionState.setSectionStateHandler({ sectionState, handler });
  }

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

  addEventListeners = () => {
    this.mainElements.timerElement.onclick =  () => {
      this.startExam();
      this.runCallbackFunctionIfExist(EXAM_EVENTS.clickTimer, null);
    };
    this.mainElements.nextButton.onclick =  () => this.handleClickNavigateButton({
      isNextButton: true
    });
    this.mainElements.backButton.onclick =  () => this.handleClickNavigateButton({
      isNextButton: false
    });
    this.mainElements.retestButton.onclick =  () => {
      this.startExam();
      this.runCallbackFunctionIfExist(EXAM_EVENTS.clickRetestButton, null);
    };
    this.mainElements.homeButton.onclick =  () => {
      this.sectionState.changeSectionState({
        state: SECTION_STATES.initial,
        mainElements: this.mainElements
      })
      this.runCallbackFunctionIfExist(EXAM_EVENTS.clickHomeButton, null);
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
      this.runCallbackFunctionIfExist(EXAM_EVENTS.clickNavigateButton, null);
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

  startExam = () => {
    this.exam = this.getNewExam();
    this.exam.loadRandomExam().then(() => {
      this.mainElements.examContainer.querySelector("h3.exam-exp").innerHTML = 
      `Expired in <strong>${timeFormat(this.exam.getExpiredTime())}</strong>`;
      this.timer.reset({
        timeoutInSecond: this.exam.getExpiredTime(),
        onEnd: this.onEndExam
      });
      this.timer.start();
      this.showQuestion({
        isGettingNextQuestion: true
      });
      this.sectionState.changeSectionState({
        state: SECTION_STATES.doingExam,
        mainElements: this.mainElements
      });
    }).catch((error) => {
      console.error(error);
    });
  };

  onEndExam = () => {
    const results = this.exam.getResults();
    this.showResult({
      mainElements: this.mainElements,
      timer: this.timer,
      exam: this.exam,
      results
    })
  }

  // Show mark & compare user's answer vs ground truth
  showResult = ({
    mainElements,
    timer,
    exam,
    results
  }) => {
    // Render HTML based on the results 
    mainElements.resultContainer.innerHTML = Result({
      results, 
      timeDoneInSecond: exam.getExpiredTime() - timer.getCurrentTimeout()
    });
    this.sectionState.changeSectionState({
      state: SECTION_STATES.viewingResult,
      mainElements: this.mainElements
    });
    this.runCallbackFunctionIfExist(SECTION_STATES.viewingResult, { results });
  };

  getQuestion = ({
    isGettingNextQuestion
  }) => {
    return isGettingNextQuestion 
    ? this.exam.getNextQuestion() 
    : this.exam.getPreviousQuestion();
  }

  renderQuestion = ({
    mainElements,
    questionUIFactory, 
    renderData
  }) => {
    mainElements.questionContainer.innerHTML = questionUIFactory.renderQuestion(renderData);
  }

  showQuestion = ({
    isGettingNextQuestion
  }) => {
    const { question, userAnswer } = this.getQuestion({ isGettingNextQuestion });
    if (question) {
      try {
        this.renderQuestion({
          mainElements: this.mainElements, 
          questionUIFactory: this.questionUIFactory, 
          renderData: { question, userAnswer }
        });
        this.changeStateOfNavigateButton({
          mainElements: this.mainElements,
          exam: this.exam
        });
      } catch (error) {
        console.error(error);
      }
    };
  };

  changeStateOfNavigateButton = ({ mainElements, exam }) => {
    mainElements.backButton.disabled = !exam.hasPreviousQuestion();
    if (!exam.hasNextQuestion()) {
      mainElements.nextButton.innerText = 'Submit';
    } else {
      mainElements.nextButton.innerText = 'Next';
    }
  };
}

export default ExamComponent;