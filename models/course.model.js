const mongoose = require("mongoose")
const courseSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    prerequisites: { type: [String], default: [] },
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'lecture' }]
 },{
     versionKey:false
 });
 
 const courseModel = mongoose.model("course", courseSchema);
 
 module.exports = { courseModel };
 