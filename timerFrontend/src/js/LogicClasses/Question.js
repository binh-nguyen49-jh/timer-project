
class Question{
  constructor({content, answer}) {
    this.content = content;
    this.answer = answer;
    if (this.constructor === Question) {
      throw new Error("You cannot create an instance of Abstract Class");
    }
    if (this.checkAnswer === undefined) {
      throw new TypeError('Override checkAnswer function');
    }
  };
}


export class MultiChoiceQuestion extends Question{
  constructor({content, answer, choices}){
    super({content, answer});
    this.choices = choices;
  };
  
  checkAnswer(userAnswer){
    if(!userAnswer) {
      return false;
    }
    return this.answer === userAnswer;
  };
}

export class TextQuestion  extends Question{
  constructor({content, answer}){
    super({content, answer});
    this.keywords =  answer.match(/[A-Za-z0-9]+/g);
  };

  checkAnswer(userAnswer){
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
      }
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

export class QuestionFactory{
  static loadQuestions(questions){
    const questionInstances = [];
    for (let question of questions) {
      if (question.choices) {
        questionInstances.push(new MultiChoiceQuestion({
          content: question.content,
          answer: question.answer,
          choices: question.choices
        }));
      } else {
        questionInstances.push(new TextQuestion({
          content: question.content,
          answer: question.answer
        }));
      }
    }
    return questionInstances;
  };
}