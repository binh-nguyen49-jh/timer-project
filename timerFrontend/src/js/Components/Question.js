function TextQuestion({question, userAnswer}) {
  return `
  <div class="question">
    <p class = "question-content">Câu hỏi: ${question.content}</p>
    <form >
      <label for="answer">Trả lời</label>
      <input type="text" name="answer" value = ${userAnswer? userAnswer: ''}>
    </form>
  </div>
  `
}

function MultipleChoiceQuestion({question, userAnswer}) {
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
  `
}

export default function Question({
  question,
  userAnswer,
  isPlainTextQuestion
}) {
  return isPlainTextQuestion ? TextQuestion({question, userAnswer}) : MultipleChoiceQuestion({question, userAnswer});
}