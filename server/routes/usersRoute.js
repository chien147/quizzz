const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', async (req, res) => {
    try {
        
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res
                .status(200)
                .send({ message: "người dùng đã tồn tại", success: false });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        //tạo user vào db
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            message: "đăng ký tài khoản thành công",
            success: true,
        })
    }
    catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(200)
                .send({ message: "người dùng không tồn tại", success: false })
        }
        const validpassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validpassword) {
            return res
                .status(200)
                .send({ message: " mật khẩu không hợp lệ", success: false });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '60d' }
        )
        res.send({
            message: "đăng nhập thành công",
            success: true,
            data: token,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        })
    }
})

router.post('/get_user_info',authMiddleware ,async (req, res)=>{
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            message: "thông tin người dùng tìm thành công",
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
})


module.exports = router;
