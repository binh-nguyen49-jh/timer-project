const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam.controllers");
router.get('/', examController.getRandomExam);

module.exports = router;