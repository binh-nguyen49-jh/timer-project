const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const http = require("http");
const examRoutes = require("./routes/exam.routes")
// Set up Global configuration access
dotenv.config();
const app = express();

var corsOptions = {
    origin: "http://localhost:8080"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended:  true }));

app.use('/exam', examRoutes);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} ...`);
});
// Socket & Error handler middleware
app.use((err, req, res, next) => {
    if(err)
    res.status(err.status).send({
        error: err.message
    });
});
