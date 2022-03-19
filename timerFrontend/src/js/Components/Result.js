import { QUESTION_ERRORS, QUESTION_TYPES } from "../../config/config";
import { QuestionFactoryAbstract } from "../LogicClasses/Question";
import timeFormat from "../utils/timeFormat";

function Result({
  results, 
  timeDoneInSecond,
  questionResultUIFactory
}) {
  const mark = results.reduce((mark, {
    isCorrect
  }) => {
    return isCorrect ? mark + 1 : mark;
  }, 0);
  const numberOfQuestions = results.length;

  return `
  <h3>Result</h3>
  <div class = "container done-time__container">
    <p class = "done-time">Done in <strong>${timeFormat(timeDoneInSecond)}</strong></p>
  </div>
  <div class="mark container">
    <div class= "mark__range --low"></div>
    <div class="mark__range --medium"></div>
    <div class="mark__range --high"></div>
    <div style="width: ${mark / numberOfQuestions * 100}%" class= "mark__current">
      <span class="mark-value">${mark / numberOfQuestions * 100}%</span>
    </div>
  </div>
  <div class="compare-result container">
    <div class="container compare-result__container">
      ${
        results.map((result, idx) => questionResultUIFactory.renderQuestion({
          ...result,
          idx
        }))
      }
    </div>
  </div>
  `;
}
const DefaultQuestionResult = ({
  question,
  groundTruth,
  userAnswer,
  isCorrect,
  idx
}) => {
  return `
    <div class="result-question">
      <strong class="result-question__order flex-center">Câu ${idx + 1}</strong>
      <div class="compare flex-center">
        <p class="question-content">${question}</p>
        <p class="question-content ground-truth">GroundTruth: ${groundTruth}</p>
        <p class="question-content answer">Answer: ${userAnswer}</p>
      </div>
      <strong class="result flex-center">
        ${isCorrect? '<i class="true fa-solid fa-check"></i>' : '<i class="fa-solid false fa-circle-xmark"></i>'}
      </strong>
    </div>
  `
}

export class QuestionResultUIFactory extends QuestionFactoryAbstract{
  constructor(questionTypeMapper){
    super(questionTypeMapper)
    if(!questionTypeMapper){
      this.setQuestionTypeMapping({
        questionType: QUESTION_TYPES.multipleChoice, 
        questionClass: DefaultQuestionResult
      });
      this.setQuestionTypeMapping({
        questionType: QUESTION_TYPES.text, 
        questionClass: DefaultQuestionResult
      });
    }
  }

  renderQuestion (renderData) {
    if (this.questionTypeMapper[renderData.type]) {
      return this.questionTypeMapper[renderData.type](renderData);
    } else {
      throw Error(QUESTION_ERRORS.NotExistingType);
    }
  }
}
export default Result;