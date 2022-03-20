import { Question } from "./LogicClasses/Question";

export class MultiSelectQuestion extends Question {
  constructor({
    type,
    content, 
    answer,
    choices
  }) {
    super({
      type,
      content, 
      answer,
      choices
    });
    this.choices = choices;
  };
  
  checkAnswer(userAnswer) {
    if (!userAnswer) {
        return false;
    }
    return userAnswer === this.answer;
  }
}

export function MultiSelectQuestionUI({
    question, 
    userAnswer
  }) {
    return `
    <div class="question --multi-select">
      <p class = "question-content">Câu hỏi: ${question.content}</p>
      <form >
        <div class="container">
        ${
          question.choices.map((choice, idx) => `
          <div class="question__choice">
              <label class="choice-label">
                <input type="checkbox" class="choice-input" name="choice" value="${idx}" ${userAnswer === choice? 'checked': ''}>
                <img class="choice-image" src="${choice}" alt="">
              </label>
          </div>
          `).join('')
        }
        </div>
      </form>
    </div>
    `;
  }
export const getMultiSelectAnswer = () => {
  const choiceCheckboxes = document.querySelectorAll('input[name="choice"]');
  const answers = [];
  for (let choiceCheckbox of choiceCheckboxes) {
    if (choiceCheckbox.checked) {
        answers.push(choiceCheckbox.value);
    }
  }
  return answers.join(", ");
}