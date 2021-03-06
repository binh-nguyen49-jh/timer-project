import ExamAPI from "../API/ExamAPI";
import { QuestionFactory } from "./Question";

export default class Exam {
  #questions;
  #expiredTimeInSecond;
  #userAnswers;
  #idxOfCurrentQuestion;
  
  constructor() {
    this.#questions = [];
    this.#expiredTimeInSecond = 0;
    this.#userAnswers = [];
    this.#idxOfCurrentQuestion = -1;
    this.questionFactory = new QuestionFactory();
  };
  
  setQuestionTypeMapping({ questionType, questionClass }) {
    this.questionFactory.setQuestionTypeMapping({ questionType, questionClass });
  };

  getCurrentQuestion() {
    return this.#questions[this.#idxOfCurrentQuestion];
  };
  
  loadRandomExam = () => new Promise((resolve, reject) => {
    ExamAPI.get().then((examInJSON) => {
      this.#questions = this.questionFactory.loadQuestions(examInJSON.questions);
      this.#expiredTimeInSecond = examInJSON.expiredTimeInSecond;
      this.#userAnswers = new Array(this.#questions.length).fill("");
      this.#idxOfCurrentQuestion = -1;
      resolve();
    }).catch((error) => {
      reject(error);
    });
  });

  getExpiredTime() {
    return this.#expiredTimeInSecond;
  };

  getNumberOfQuestions() {
    return this.#questions.length;
  };

  getNextQuestion() {
    return {
      question: this.#questions[++this.#idxOfCurrentQuestion],
      userAnswer: this.#userAnswers[this.#idxOfCurrentQuestion]
    };
  };

  getPreviousQuestion() {
    return {
      question: this.#questions[--this.#idxOfCurrentQuestion],
      userAnswer: this.#userAnswers[this.#idxOfCurrentQuestion]
    };
  };

  hasNextQuestion() {
    return this.#idxOfCurrentQuestion < this.#questions.length - 1;
  };
  
  hasPreviousQuestion() {
    return this.#idxOfCurrentQuestion > 0;
  };
  
  setUserAnswer(answer) {
    this.#userAnswers[this.#idxOfCurrentQuestion] = answer;
  };

  getResults() {
    const results = []
    for (let questionIdx = 0; questionIdx < this.#questions.length; questionIdx++) {
      const question = this.#questions[questionIdx];
      const userAnswer = this.#userAnswers[questionIdx];
      results.push({
        question: question.content,
        groundTruth: question.answer,
        userAnswer,
        mark: question.checkAnswer(userAnswer),
        type: question.type
      });
    }
    return results;
  };
}