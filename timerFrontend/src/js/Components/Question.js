import { QUESTION_TYPES, QUESTION_ERRORS } from "../../config/config";
import { QuestionFactoryAbstract } from "../LogicClasses/Question";

function TextQuestion({
  question, 
  userAnswer
}) {
  return `
  <div class="question">
    <p class = "question-content">Câu hỏi: ${question.content}</p>
    <form >
      <label for="answer">Trả lời</label>
      <input type="text" name="answer" value = ${userAnswer? userAnswer: ''}>
    </form>
  </div>
  `;
}

function MultipleChoiceQuestion({
  question, 
  userAnswer
}) {
  return `
  <div class="question --multichoices">
    <p class = "question-content">Câu hỏi: ${question.content}</p>
    <form >
      <div class="container">
      ${
        question.choices.map((choice) => `
        <div class="question__choice">
          <label class="choice-label">
            <input type="radio" class="choice-input" name="choice" value="${choice}" ${userAnswer === choice? 'checked': ''}>
            ${choice}
          </label>
        </div>
        `).join('')
      }
      </div>
    </form>
  </div>
  `;
}

export default class QuestionUIFactory extends QuestionFactoryAbstract{
  constructor(questionTypeMapper){
    super(questionTypeMapper)
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

  renderQuestion ({ question, userAnswer }) {
    if (this.questionTypeMapper[question.type]) {
      return this.questionTypeMapper[question.type]({ question, userAnswer });
    } else {
      throw Error(QUESTION_ERRORS.NotExistingType);
    }
  }
}