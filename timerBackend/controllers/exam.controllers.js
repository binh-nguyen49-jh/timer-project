const fs = require("fs")
const createErrors  = require("http-errors")


const getRandomExam = ({res, next}) => {
    try {
        
        const fileNames = fs.readdirSync(process.env.FILE_DIRECTORY)
        const randomNum = Math.floor(Math.random()*fileNames.length)
        console.log(fileNames, randomNum)
        const exam = fs.readFileSync(`${process.env.FILE_DIRECTORY}/exam2.json`, {encoding:'utf8', flag:'r'})
        if(exam)
        res.status(200).send( JSON.parse(exam))
        else
        next(createErrors.InternalServerError("Something went wrong!"))
        // fs.readdirSync(dirPath).forEach(function(file) {
        //     let filepath = path.join(dirPath , file);
        //     let stat= fs.statSync(filepath);
        //     if (stat.isDirectory()) {            
        //       getAllFiles(filepath);
        //     } else {
        //           console.info(filepath+ '\n');                      
        //     }    
    } catch (error) {
        console.error(error)
        next(createErrors.InternalServerError("Something went wrong!"))
    }
}

module.exports = {
    getRandomExam
}