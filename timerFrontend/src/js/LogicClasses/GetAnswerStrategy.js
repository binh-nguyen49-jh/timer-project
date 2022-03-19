import { QUESTION_TYPES } from "../../config/config";

export default class GetAnswerStrategy{
  constructor() {
    this.getAnswerHandlers = {};
    this.setGetAnswerHandler({ 
        questionType: QUESTION_TYPES.multipleChoice, 
        getAnswerHandler: this.getMultipleChoiceQuestionAnswer
      });
    this.setGetAnswerHandler({
        questionType: QUESTION_TYPES.text, 
        getAnswerHandler: this.getTextQuestionAnswer
    });
  }
  setGetAnswerHandler = ({ questionType, getAnswerHandler }) => {
    this.getAnswerHandlers[questionType] = getAnswerHandler;
  }
  
  getTextQuestionAnswer = () => {
    const textInputElement = document.querySelector('input[name="answer"]');
    if (textInputElement) {
      return textInputElement.value;
    };
    return ''
  }

  getMultipleChoiceQuestionAnswer = () => {
    const choiceCheckboxes = document.querySelectorAll('input[name="choice"]');
    for (let choiceCheckbox of choiceCheckboxes) {
      if (choiceCheckbox.checked) {
        return choiceCheckbox.value;
      }
    }
    return '';
  }

  getAnswer = ({ questionType }) => {
    if (this.getAnswerHandlers[questionType]) {
      try {
        return this.getAnswerHandlers[questionType]();
      } catch (error) {
        throw Error(GET_USER_ANSWER_ERRORS.CannotGetUserAnswer);
      }
    } else {
      throw Error(GET_USER_ANSWER_ERRORS.NotExistingType);
    }
  }
}