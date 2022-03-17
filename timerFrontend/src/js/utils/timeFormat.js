const timeFormat = (timeInSecond) =>{
  const hour = String(Math.floor(timeInSecond / 3600)).padStart(2, '0');
  const minute = String(Math.floor(timeInSecond % 3600 / 60)).padStart(2, '0');
  const second = String(timeInSecond % 3600 % 60).padStart(2, '0');;
  return `${hour}:${minute}:${second}`;
};
export default timeFormat;