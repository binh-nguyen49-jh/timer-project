export const CLASS_ERRORS = {
  InstantiateAnAbstractClass: "You cannot create an instance of Abstract Class"
}
export const QUESTION_TYPES = {
  multipleChoice: "multiple_choice",
  text: "text"
}

export const QUESTION_ERRORS = {
  NotImplementCheckAnswerFunction: "You did not implement the checkAnswer function",
  NotExistingType: "The question's type is not existing"
}
export const QUESTION_FACTORY_ERRORS = {
  NotImplementProduceQuestion: "You did not implement the produceQuestion function"
}

export const GET_USER_ANSWER_ERRORS = {
  CannotGetUserAnswer: "Cannot get user answer",
  NotExistingType: "The question's type is not existing"
}

export const EXAM_EVENTS = {
  clickTimer: "ClickTimerButton",
  clickRetestButton: "ClickRetestButton",
  clickNavigateButton: "ClickNavigateButton",
  clickHomeButton: "ClickHomeButton",
  timeout: "Timeout"
}

export const SECTION_STATES = {
  initial: "InitialState",
  doingExam: "DoingExam",
  viewingResult: "ViewingResult"
}

export const SECTION_ERRORS = {
  NotExistingState: (state) => `${state} is not an existing section state`,
  NotExistingHandler: (state) => `There is no implemented handler for ${state} section state`
}