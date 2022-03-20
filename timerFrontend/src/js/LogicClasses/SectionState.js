import { SECTION_ERRORS, SECTION_STATES } from "../../config/config";
import timeFormat from "../utils/timeFormat";

export default class SectionState{
  constructor(){
    this.sectionStateHandlers = {};
    this.setSectionStateHandler({
      sectionState: SECTION_STATES.initial, 
      handler: this.changeToInitialState
    });
    this.setSectionStateHandler({
      sectionState: SECTION_STATES.doingExam, 
      handler: this.changeToExamState
    });
    this.setSectionStateHandler({
      sectionState: SECTION_STATES.viewingResult, 
      handler: this.changeToResultState
    });
  }

  setSectionStateHandler = ({
    sectionState,
    handler
  }) => {
    this.sectionStateHandlers[sectionState] = handler;
  }

  changeToInitialState = ({ mainElements }) => {
    this.changeSectionState({
      state: SECTION_STATES.doingExam,
      mainElements
    });
    mainElements.examContainer.style.display = "none";
    mainElements.timerElement.innerText = timeFormat(0);
  };

  changeToResultState = ({ mainElements }) => {
    // Show element of result section
    mainElements.retestButton.style.display = 'block';
    mainElements.homeButton.style.display = 'block';
    // Hide element of exam section
    mainElements.timerElement.style.display = 'none';
    mainElements.questionContainer.style.display = 'none';
    mainElements.examContainer.style.display = 'none';
  }
  
  changeToExamState = ({ mainElements }) => {
    // Show element of exam section
    mainElements.examContainer.style.display = 'block';
    mainElements.questionContainer.style.display = 'block';
    mainElements.timerElement.style.display = 'block';
    // Hide element of result section
    mainElements.retestButton.style.display = 'none';
    mainElements.homeButton.style.display = 'none';
    mainElements.resultContainer.innerHTML = '';
  }

  changeSectionState = ({ state, mainElements }) => {
    if(this.sectionStateHandlers[state]){
      this.sectionStateHandlers[state]({ mainElements })
    }else{
      throw Error(SECTION_ERRORS.NotExistingHandler(state));
    }
  };
}