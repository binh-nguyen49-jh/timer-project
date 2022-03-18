import timeFormat from "../utils/timeFormat";

function Timer ({
  timerElement,
  timeoutInSecond = 0,
  onEnd = () => {}
}){
  this.timerElement = timerElement;
  this.timeoutInSecond = timeoutInSecond;
  this.onEnd = onEnd;
  this.timerCountdown = null;
  this.start = () => {
    this.timerCountdown = setInterval(() => {
      this.timeoutInSecond -= 1;
      if (this.timeoutInSecond < 1) {
        clearInterval(this.timerCountdown);
        this.end();
      }
      this.timerElement.innerHTML = timeFormat(this.timeoutInSecond);
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
    timeoutInSecond,
    onEnd
  }) => {
    this.clearTimerCountdown();
    this.timeoutInSecond = timeoutInSecond;
    this.onEnd = onEnd;
  };

  this.getCurrentTimeout = () => {
    return this.timeoutInSecond;
  };
  return this;
}
export default Timer;