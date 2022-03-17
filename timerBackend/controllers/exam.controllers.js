const fs = require("fs");
const createErrors  = require("http-errors");


const getRandomExam = ({res, next}) => {
  try {  
    const fileNames = fs.readdirSync(process.env.FILE_DIRECTORY);
    const randomNum = Math.floor(Math.random() * fileNames.length);
    const exam = fs.readFileSync(`${process.env.FILE_DIRECTORY}/${fileNames[randomNum]}`, {encoding:'utf8', flag:'r'});
    if (exam) {
      res.status(200).send( JSON.parse(exam));
    } else {
      next(createErrors.InternalServerError("Something went wrong!"));
    }
  } catch(error) {
    console.error(error);
    next(createErrors.InternalServerError("Something went wrong!"));
  }
}

module.exports = {
  getRandomExam
}