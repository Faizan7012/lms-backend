require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { userRoute } = require('./routes/user.route');
const { lectureRoute } = require('./routes/lecture.route');
const { courseRoute } = require('./routes/course.route');
const { connection } = require('mongoose');

const app = express();
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.status(200).send("Welcome to LMS server")
})

app.use("/user" , userRoute)
app.use("/lecture" , lectureRoute)
app.use("/course" , courseRoute)


app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Connect to Mongodb")
    } catch (error) {
        console.log(error)
        console.log("Db is not Connected")
    }
    console.log(`server is running at ${process.env.PORT}`)

})