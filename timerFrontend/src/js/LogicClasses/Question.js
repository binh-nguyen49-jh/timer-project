import { CLASS_ERRORS, QUESTION_ERRORS, QUESTION_TYPES } from "../../config/config";

export class Question{
  constructor({
    type,
    content, 
    answer
  }) {
    this.type = type;
    this.content = content;
    this.answer = answer;
    if (this.constructor === Question) {
      throw new Error(CLASS_ERRORS.instantiateAnAbstractClass);
    };
    if (this.checkAnswer === undefined) {
      throw new TypeError(QUESTION_ERRORS.notImplementCheckAnswerFunction);
    };
  };
}


export class MultipleChoiceQuestion extends Question{
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
    this.keywords =  answer.trim().toLowerCase().split(", ");
  };

  checkAnswer(userAnswer) {
    if (!userAnswer) {
      return 0;
    }
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const userKeywords = normalizedAnswer.split(", ");
    console.log(userKeywords, this.keywords)
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
    return totalCorrectKeywords > 0? 1: 0;
  };
}

export class QuestionFactoryAbstract{
  constructor(questionTypeMapper){
    this.questionTypeMapper = {};
    if (questionTypeMapper) {
      Object.assign(this.questionTypeMapper, questionTypeMapper);
    };
    if (this.constructor === QuestionFactoryAbstract) {
      throw new Error(CLASS_ERRORS.instantiateAnAbstractClass);
    };
  }
  
  setQuestionTypeMapping = ({ questionType, questionClass }) => {
    this.questionTypeMapper[questionType] = questionClass;
  }
}

export class QuestionFactory extends QuestionFactoryAbstract{
  constructor(questionTypeMapper){
    super(questionTypeMapper);
    if(!questionTypeMapper){
      this.setQuestionTypeMapping({
        questionType: QUESTION_TYPES.multipleChoice, 
        questionClass: MultipleChoiceQuestion
      });
      this.setQuestionTypeMapping({
        questionType: QUESTION_TYPES.text, 
        questionClass: TextQuestion
      });
    }
  }

  loadQuestions(questions) {
    const questionInstances = [];
    for (let question of questions) {
      if (this.questionTypeMapper[question.type]) {
        questionInstances.push(new this.questionTypeMapper[question.type](question));
      } else {
        throw Error(QUESTION_ERRORS.NotExistingType);
      }
    }
    return questionInstances;
  };
}
