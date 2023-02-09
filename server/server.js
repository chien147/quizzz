// khai báo 1 biến và yêu cầu sử dụng module express
const express = require('express');

// có 1 biến số để giữ Express application mới của mình 
// Express không phải là phần mặc định của Node.
const app = express();

//để đọc file .env
require('dotenv').config();

//
app.use(express.json());

//connect vs db
const dbConfig = require("./config/dbConfig")

//khai báo 
const usersRoute = require('./routes/usersRoute');
const examsRoute = require('./routes/examsRoute');
const reportsRoute = require('./routes/reportsRoute');

app.use('/api/users', usersRoute);
app.use('/api/exams', examsRoute);
app.use('/api/reports', reportsRoute);

//process.env.port giá trị trong file .env
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})



