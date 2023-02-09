const router = require('express').Router();
const Exam = require('../models/examModel');
const authMiddleware = require('../middlewares/authMiddleware');
const Question = require('../models/questionModel')
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const examExists = await Exam.findOne({ name: req.body.name })
        if (examExists) {
            return res.status(200).send({ message: "kì thi đã tồn tại", success: false })
        }
        req.body.questions = []
        const newExam = new Exam(req.body);
        await newExam.save();
        res.send({
            message: 'thêm kì thi thành công',
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
});


router.post('/get-all-exams', authMiddleware, async (req, res) => {
    try {
        const exams = await Exam.find({});
        res.send({
            message: 'lấy đề thi thành công',
            data: exams,
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        })
    }
})


router.post('/get-exam-by-id', authMiddleware, async (req, res) => {
    try {
        const exam = await Exam.findById(req.body.examId).populate('questions');
        res.send({
            message: "tải đề thi thành công",
            data: exam,
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        })
    }
})

router.post('/edit-exam-by-id', authMiddleware, async (req, res) => {
    try {
        await Exam.findByIdAndUpdate(req.body.examId, req.body);
        res.send({
            message: "sửa tên kì thi thành công",
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
})

// delete
router.post('/delete-exam-by-id', authMiddleware, async (req, res) => {
    try {
        await Exam.findByIdAndDelete(req.body.examId);
        res.send({
            message: "xóa kì thi thành công",
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        })

    }
})

// add question to exam
router.post('/add-question-to-exam', authMiddleware, async (req, res) => {
    try {

        // thêm câu hỏi vào bộ sưu tầm câu hỏi
        const newQuestion = new Question(req.body);
        const question = await newQuestion.save();

        // thêm câu hỏi vào đề thi 
        const exam = await Exam.findById(req.body.exam);
        exam.questions.push(question._id);
        await exam.save();
        res.send({
            message: "thêm câu hỏi thành công",
            success: true
        })

    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,

        })

    }
})

// edit question in exam
router.post('/edit-question-in-exam', authMiddleware, async (req, res) => {
    try {
        await Question.findByIdAndUpdate(req.body.questionId, req.body);
        res.send({
            message: "sửa câu hỏi thành công",
            success: true
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        })
    }
})

// xóa câu hỏi trong đề thi

router.post("/delete-question-in-exam", authMiddleware, async(req, res)=>{
    try {
        // xóa câu hỏi trong bộ sưu tập câu hỏi
        await Question.findByIdAndDelete(req.body.questionId);
        // xóa caai hỏi trong đề thi
        const exam = await Exam.findById(req.body.examId);
        exam.questions = exam.questions.filter(
          (question) => question._id != req.body.questionId
        );
        await exam.save();
        res.send({
          message: "Question deleted successfully",
          success: true,
        });
     } catch (error) {
      
     }
})

module.exports = router;


