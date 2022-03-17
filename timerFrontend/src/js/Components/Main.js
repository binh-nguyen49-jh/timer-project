import Exam from "../LogicClasses/Exam";
import Timer from "../LogicClasses/Timer";
import timeFormat from "../utils/timeFormat";
import Question from "./Question";
import Result from "./Result";

class MainComponent {
  constructor(mainElements) {
    this.mainElements = mainElements;
    this.timer = new Timer({timerElement: this.mainElements.timerElement});
    this.addEventListeners();
    this.initializeSectionState();
     
  };

  initializeSectionState () {
    this.toggleSectionState({
      isDoingExam:true
    });
    this.mainElements.examContainer.style.display = "none";
    this.mainElements.timerElement.innerText = '00:00:00';
  };

  addEventListeners = () => {
    this.mainElements.timerElement.addEventListener("click", this.handleClickTimer);
    this.mainElements.nextButton.addEventListener("click", () => this.handleClickNavigateButton({
      isNextButton: true
    }));
    this.mainElements.backButton.addEventListener("click", () => this.handleClickNavigateButton({
      isNextButton: false
    }));
    this.mainElements.retestButton.addEventListener("click", () => this.handleClickRetestButton());
    this.mainElements.homeButton.addEventListener("click", () => this.initializeSectionState());
  };

  handleClickNavigateButton = ({
    isNextButton
  }) => {
    this.getUserAnswer();
    if (isNextButton && !this.exam.hasNextQuestion()) {
      this.handleSubmit();
    } else {
      this.showQuestion({
        isGettingNextQuestion: isNextButton
      });
    }
  }
  
  getUserAnswer = () => {
    const currentQuestion =  this.exam.getCurrentQuestion();
    let userAnswer = ''
    if (currentQuestion.choices) {
      const choiceCheckboxes = document.querySelectorAll('input[name="choice"]');
      for (let choiceCheckbox of choiceCheckboxes) {
        if (choiceCheckbox.checked) {
          userAnswer = choiceCheckbox.value  
        }
      }
    } else {
      userAnswer = document.querySelector('input[name="answer"]').value;
    }
    this.exam.setUserAnswer(userAnswer);
  }

  handleSubmit = () => {
    this.timer.end();
  };
  
  toggleSectionState = ({isDoingExam}) => {
    if (isDoingExam) {
      // Show element of exam section
      this.mainElements.examContainer.style.display = 'block';
      this.mainElements.questionContainer.style.display = 'block';
      this.mainElements.timerElement.style.display = 'block';
      // Hide element of result section
      this.mainElements.retestButton.style.display = 'none';
      this.mainElements.homeButton.style.display = 'none';
      this.mainElements.resultContainer.innerHTML = '';
    } else {
      // Show element of result section
      this.mainElements.retestButton.style.display = 'block';
      this.mainElements.homeButton.style.display = 'block';
      // Hide element of exam section
      this.mainElements.timerElement.style.display = 'none';
      this.mainElements.questionContainer.style.display = 'none';
      this.mainElements.examContainer.style.display = 'none';
    }
  };

  startExam = () => {
    this.exam = new Exam();
    this.exam.getRandomExam().then(() => {
        this.mainElements.examContainer.querySelector("h3.exam-exp").innerHTML = `Expired in <strong>${timeFormat(this.exam.getExpiredTime())}</strong>`;
    
        this.timer.reset({
          timeOutInSecond: this.exam.getExpiredTime(),
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
  }

  handleClickTimer = () => {
    this.startExam();
  };

  handleClickRetestButton = () => {
    this.startExam();
  };

  // Show mark & compare user's answer vs ground truth
  showResult = () => {
    const results = this.exam.getResults();
    // Render HTML based on the results 
    this.mainElements.resultContainer.innerHTML = Result({results, timeDoneInSecond: this.exam.getExpiredTime() -this.timer.getCurrentTimeout()});
    this.toggleSectionState({
      isDoingExam: false
    });
  };

  showQuestion = ({
    isGettingNextQuestion
  }) => {
    const {question, userAnswer} = isGettingNextQuestion ? this.exam.getNextQuestion() : this.exam.getPreviousQuestion();
    if (question) {
      if (question.choices) {
        this.mainElements.questionContainer.innerHTML = Question({
          question,
          userAnswer,
          isTextQuestion: false
        });
      } else {
        this.mainElements.questionContainer.innerHTML = Question({
          question,
          userAnswer,
          isTextQuestion: true
        });
      }
      this.changeStateOfNavigateButton();
    }
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

export default MainComponent;