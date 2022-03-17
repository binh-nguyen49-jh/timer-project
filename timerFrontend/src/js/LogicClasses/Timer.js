import timeFormat from "../utils/timeFormat";

function Timer ({
  timerElement,
  timeOutInSecond = 0,
  onEnd = () => {}
}){
  this.timerElement = timerElement;
  this.timeOutInSecond = timeOutInSecond;
  this.onEnd = onEnd;
  this.timerCountdown = null;
  this.start = () => {
    this.timerCountdown = setInterval(() => {
      this.timeOutInSecond -= 1;
      if (this.timeOutInSecond < 1) {
        clearInterval(this.timerCountdown);
        this.end();
      }
      this.timerElement.innerHTML = timeFormat(this.timeOutInSecond);

    }, 1000);
  };

  this.clearTimerCountdown = () => {
    if (this.timerCountdown) {
      clearInterval(this.timerCountdown);
    }
  };

  this.end = () => {
    this.clearTimerCountdown();
    this.onEnd();
  };

  this.reset = ({
    timeOutInSecond,
    onEnd
  }) => {
    this.clearTimerCountdown();
    this.timeOutInSecond = timeOutInSecond;
    this.onEnd = onEnd;
  };
  
  this.getCurrentTimeout = () => {
    return this.timeOutInSecond;
  };
  return this;
}
export default Timer;