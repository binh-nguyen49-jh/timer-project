const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const http = require("http");
const examRoutes = require("./routes/exam.routes")

dotenv.config();
const app = express();

const corsOptions = JSON.parse(process.env.CORS_OPTIONS);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended:  true }));
app.use('/exam', examRoutes);
const PORT = process.env.PORT || process.env.DEFAULT_PORT;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});

app.use(({err, res}) => {
  if(err)
  res.status(err.status).send({
    error: err.message
  });
});
