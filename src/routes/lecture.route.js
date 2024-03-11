const express = require("express");
const { adminAuth } = require("../middlewares/admin");
const { lectureModel } = require("../models/lecture.model");
const { courseModel } = require("../models/course.model");
const { userAuth } = require("../middlewares/user");
const lectureRoute = express.Router();



lectureRoute.post("/create",adminAuth,async(req,res)=>{

    try {
        const newLecture = await lectureModel.create(req.body);
        await newLecture.save()

         // Add lecture ID to the course
         const course = await courseModel.findById(req.body.course);
         if (!course) {
             return res.status(404).json({ message: 'Course not found' , status:false });
         }
         if (course.lectures.includes(newLecture._id)) {
             return res.status(400).json({ message: 'Lecture already added to the course' , status:false });
         }
         course.lectures.push(newLecture._id);
         await course.save();

        res.status(201).send({message:"Lecture Created", status:true,newLecture});
    } catch (error) {
        res.status(500).send({ message: error.message , status:false});
    }
})

lectureRoute.get('/',adminAuth ,async (req, res) => {
    try {
        const lectures = await lectureModel.find();
        res.status(201).send({lectures, status:true});
    } catch (error) {
        res.status(500).send({ message: error.message , status:false });
    }
});

lectureRoute.get('/:id', userAuth , async (req, res) => {
    try {
        const lecture = await lectureModel.findById(req.params.id);
        if (!lecture) {
            return res.status(404).send({ message: 'Lecture not found' , status:false});
        }
        res.status(201).send({lecture , status:true});
    } catch (error) {
        res.status(500).send({ message: error.message, status:false });
    }
});


lectureRoute.put('/:id',adminAuth,async (req, res) => {
    try {
        const updatedLecture = await lectureModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLecture) {
            return res.status(404).send({ message: 'Lecture not found' , status:false});
        }
        res.status(201).send({message:"Lecture Updated",updatedLecture , status:true});
    } catch (error) {
        res.status(500).send({ message: error.message , status:false});
    }
});

lectureRoute.delete('/:id', adminAuth ,  async (req, res) => {
    try {
        const deletedLecture = await lectureModel.findByIdAndDelete(req.params.id);
        if (!deletedLecture) {
            return res.status(404).send({ message: 'Lecture not found' , status:false});
        }
        const course = await courseModel.findOneAndUpdate(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } },
            { new: true }
        );

        res.status(201).send({ message: 'Lecture deleted successfully' , status:true});
    } catch (error) {
        res.status(500).send({ message: error.message , status:false});
    }
});


module.exports={lectureRoute}