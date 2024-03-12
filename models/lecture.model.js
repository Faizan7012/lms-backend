const mongoose = require("mongoose")
const lectureSchema = mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String } 
 },{
     versionKey:false
 });
 
 const lectureModel = mongoose.model("lecture", lectureSchema);
 
 module.exports = { lectureModel };
 