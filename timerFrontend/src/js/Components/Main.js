import { error } from "jquery";
import Exam from "../LogicClasses/Exam";
import Timer from "../LogicClasses/Timer";
import timeFormat from "../utils/timeFormat";
import Question from "./Question";
import Result from "./Result";

class MainComponent {
    constructor(mainElements) {
        this.mainElements = mainElements;
        this.timer = new Timer({timerElement: this.mainElements.timerElement})
        this.addEventListeners();
        this.initializeSectionState();
       
    }
    initializeSectionState(){
        this.toggleSection({
            isDoingExam:true
        })
        this.mainElements.examContainer.style.display = "none"
        this.mainElements.timerElement.innerText = '00:00:00'
    }
    addEventListeners = () => {
        this.mainElements.timerElement.addEventListener("click", this.handleClickTimer)
        this.mainElements.nextButton.addEventListener("click", () => this.handleClickTraverseButton({
            isNextButton: true
        }))
        this.mainElements.backButton.addEventListener("click", () => this.handleClickTraverseButton({
            isNextButton: false
        }))
        this.mainElements.retestButton.addEventListener("click", () => this.startExam())
        this.mainElements.homeButton.addEventListener("click", () => this.initializeSectionState())
    }

    handleClickTraverseButton = ({
        isNextButton
    }) => {
        this.getUserAnswer();
        if(isNextButton && !this.exam.hasNextQuestion())
            this.handleSubmit();
        else
        this.showQuestion({
            isGettingNextQuestion: isNextButton
        });
        
    }
    
    getUserAnswer = () => {
        const currentQuestion =  this.exam.getCurrentQuestion();
        let userAnswer = ''
        if(currentQuestion.choices){
            const choiceRadioCheckboxes = document.querySelectorAll('input[name="choice"]')
            for(let choiceRadioCheckbox of choiceRadioCheckboxes){
                if(choiceRadioCheckbox.checked){
                    userAnswer = choiceRadioCheckbox.value    
                }
            }
        }else{
            userAnswer = document.querySelector('input[name="answer"]').value
        }
        this.exam.setUserAnswer(userAnswer)
    }

    handleSubmit = () => {
        this.timer.end();
    }
    
    toggleSection = ({isDoingExam}) => {
        if(isDoingExam){
            // Show element of exam section
            this.mainElements.examContainer.style.display = 'block'
            this.mainElements.questionContainer.style.display = 'block'
            this.mainElements.timerElement.style.display = 'block'
            // Hide element of result section
            this.mainElements.retestButton.style.display = 'none'
            this.mainElements.homeButton.style.display = 'none'
            this.mainElements.resultContainer.innerHTML = ''
        }else{
            // Show element of result section
            this.mainElements.retestButton.style.display = 'block'
            this.mainElements.homeButton.style.display = 'block'
            // Hide element of exam section
            this.mainElements.timerElement.style.display = 'none'
            this.mainElements.questionContainer.style.display = 'none'
            this.mainElements.examContainer.style.display = 'none'
        }
    }
    startExam = () => {
        this.exam = new Exam();
        this.exam.getRandomExam().then(
            ()=>{
                this.mainElements.examContainer.querySelector("h3.exam-exp").innerHTML = `Expired in <strong>${timeFormat(this.exam.getExpiredTime())}</strong>`
        
                this.timer.reset({
                    timeOutInSecond: this.exam.getExpiredTime(),
                    onEnd: this.showResult
                })
                
                this.timer.start()

                this.showQuestion({
                    isGettingNextQuestion: true
                })
                this.toggleSection({
                    isDoingExam: true
                })
            }
        ).catch((error)=>{
            console.error(error)
        })
    }

    handleClickTimer = () => {
        this.startExam()
    }

    handleClickReTest = () => {
        this.startExam()
    }

    // Show mark & compare user's answer vs ground truth
    showResult = () => {
        let compareResults = this.exam.getResults();
        // Render HTML based on the compareResults 
        this.mainElements.resultContainer.innerHTML = Result({compareResults, timeDoneInSecond: this.exam.getExpiredTime() -this.timer.getCurrentTimeout()})
        this.toggleSection({
            isDoingExam: false
        })
    }

    showQuestion = ({
        isGettingNextQuestion
    }) => {
        let {question, userAnswer} = isGettingNextQuestion ? this.exam.getNextQuestion() : this.exam.getPreviousQuestion();
        if(question){
            if (question.choices) {
                this.mainElements.questionContainer.innerHTML = Question({
                    question,
                    userAnswer,
                    isPlainTextQuestion: false
                })
            } else {
                this.mainElements.questionContainer.innerHTML = Question({
                    question,
                    userAnswer,
                    isPlainTextQuestion: true
                })
            }
            
            this.mainElements.backButton.disabled = !this.exam.hasPreviousQuestion();

            if(!this.exam.hasNextQuestion())
            this.mainElements.nextButton.innerText = 'Submit'
            else
            this.mainElements.nextButton.innerText = 'Next'
        }
    }
}

export default MainComponent;