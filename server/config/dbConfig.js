const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL)
const connection = mongoose.connection;

connection.on('connected', ()=>{
    console.log("kết nối với mongoodb thành công");
})

connection.on("error", ()=>{
    console.log("kết nối với mongoodb thất bại");
})

module.exports = connection;
