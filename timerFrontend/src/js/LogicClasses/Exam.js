import ExamAPI from "../API/ExamAPI";
import { QuestionFactory } from "./Question";

export default class Exam {
    #questions;
    #expiredTimeInSecond;
    #userAnswers;
    #currentIndexQuestion;
    
    constructor(){
    this.#questions = []
    this.#expiredTimeInSecond = 0
    this.#userAnswers = []
    this.#currentIndexQuestion = -1
        
    }
    getCurrentQuestion = () => {
        return this.#questions[this.#currentIndexQuestion];
    }
    getRandomExam = () => new Promise((resolve, reject) => {
        ExamAPI.get().then( (examInJSON) => {
            console.log(examInJSON)
            this.#questions = QuestionFactory.loadQuestions(examInJSON.questions);
            this.#expiredTimeInSecond = examInJSON.expiredTimeInSecond;
            this.#userAnswers = new Array(this.#questions.length).fill("");
            this.#currentIndexQuestion = -1;
            resolve();
        }).catch((error)=>{
            reject(error)
        })
    })
    getExpiredTime = () => {
        return this.#expiredTimeInSecond;
    }
    getNumberOfQuestions(){
        return this.#questions.length;
    }
    getNextQuestion(){
        return {
            question: this.#questions[++this.#currentIndexQuestion],
            userAnswer: this.#userAnswers[this.#currentIndexQuestion]
        };
    }
    getPreviousQuestion(){
        return {
            question: this.#questions[--this.#currentIndexQuestion],
            userAnswer: this.#userAnswers[this.#currentIndexQuestion]
        };
    }

    hasNextQuestion(){
        return this.#currentIndexQuestion < this.#questions.length - 1;
    }
    hasPreviousQuestion(){
        return this.#currentIndexQuestion > 0;
    }
    
    setUserAnswer(answer){
        this.#userAnswers[this.#currentIndexQuestion] = answer;
    }
    getResults(){
        const results = []
        for(let idx =0; idx < this.#questions.length; idx++){
            const question = this.#questions[idx];
            const userAnswer = this.#userAnswers[idx];
            results.push({
                question: question.content,
                groundTruth: question.answer,
                userAnswer,
                isCorrect: question.checkAnswer(userAnswer)
            })
        }
        return results;
    }
}