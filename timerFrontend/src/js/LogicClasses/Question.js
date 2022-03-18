import { QUESTION_ERRORS, QUESTION_TYPES } from "../../config/config";

class Question{
  constructor({
    type,
    content, 
    answer
  }) {
    this.type = type;
    this.content = content;
    this.answer = answer;
    if (this.constructor === Question) {
      throw new Error(QUESTION_ERRORS.instantiateAnAbstractClass);
    };
    if (this.checkAnswer === undefined) {
      throw new TypeError(QUESTION_ERRORS.notImplementCheckAnswerFunction);
    };
  };
}


export class MultiChoiceQuestion extends Question{
  constructor({
    type,
    content, 
    answer, 
    choices
  }) {
    super({
      type,
      content, 
      answer
    });
    this.choices = choices;
  };

  checkAnswer(userAnswer) {
    if(!userAnswer) {
      return false;
    };
    return this.answer === userAnswer;
  };
}

export class TextQuestion  extends Question{
  constructor({
    type,
    content, 
    answer
  }) {
    super({
      type,
      content, 
      answer
    });
    this.keywords =  answer.match(/[A-Za-z0-9]+/g);
  };

  checkAnswer(userAnswer) {
    if (!userAnswer) {
      return false;
    }
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const userKeywords = normalizedAnswer.match(/[A-Za-z0-9]+/g);
    const countKeywords = {}
    for (let word of userKeywords) {
      // Mark as user answer right keywords
      if (this.keywords.indexOf(word) !== -1) {
        countKeywords[word] = 1;
      };
    }
    let totalCorrectKeywords = 0;
    for (let word of userKeywords) {
      const isExist = countKeywords[word]? 1 : 0;
      totalCorrectKeywords += isExist;
    }
    // TODO: Find another way
    return totalCorrectKeywords > 0;
  };
}

export function loadQuestions(questions) {
  const questionInstances = [];
  for (let question of questions) {
    if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
      questionInstances.push(new MultiChoiceQuestion({
        type: question.type,
        content: question.content,
        answer: question.answer,
        choices: question.choices
      }));
    } else {
      questionInstances.push(new TextQuestion({
        type: question.type,
        content: question.content,
        answer: question.answer
      }));
    }
  }
  return questionInstances;
};