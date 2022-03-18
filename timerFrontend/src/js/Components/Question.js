import { QUESTION_TYPES, QUESTION_UI_ERRORS } from "../../config/config";

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

export default function Question({
  question,
  userAnswer
}) {
  if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
    return MultipleChoiceQuestion({ question, userAnswer });
  } else if (question.type === QUESTION_TYPES.TEXT){
    return TextQuestion({ question, userAnswer });
  } else {
    throw Error(QUESTION_UI_ERRORS.NotExistingType);
  }
}