const express = require("express");
const { adminAuth } = require("../middlewares/admin");
const { courseModel } = require("../models/course.model");
const { userAuth } = require("../middlewares/user");
const { lectureModel } = require("../models/lecture.model");
const { userModel } = require("../models/user.model");
const courseRoute = express.Router();

courseRoute.post("/create" , adminAuth,async(req,res)=>{

    try {
         const course = await courseModel.findOne({name:req.body.name});
         if (course) {
             return res.status(404).send({ message: 'Course already There' , status:false });
         }
         const newCourse = await courseModel.create(req.body);
         await newCourse.save()

        res.status(201).send({message:"Course Created",status:true,newCourse});
    } catch (error) {
        res.status(500).send({ message: error.message , status:false});
    }
})

courseRoute.get('/getAllCourses', userAuth, async (req, res) => {
    try {
        const courses = await courseModel.find();
        res.status(201).send({courses:courses , status:true});
    } catch (error) {
        res.status(500).send({ message: error.message , status:false});
    }
});

courseRoute.get('/:id', userAuth , async (req, res) => {
    try {
        const course = await courseModel.findById(req.params.id);
        if (!course) {
            return res.status(404).send({ message: 'Course not found', status:false });
        }
        res.status(201).send({course, status:true});
    } catch (error) {
        res.status(500).send({ message: error.message , status:false});
    }
});

courseRoute.get("/:id/lectures" , userAuth , async(req,res)=>{
    try {

    const courseId = req.params.id;
    const course = await courseModel.findById(courseId).populate("lectures");
    
    if (!course) {
      return res.status(404).send({ message: "Course not found" , status:false});
    }
    
    res.status(201).send({message:"lecture found successfully",lectures:course.lectures , status:true});

    } catch (error) {
        res.status(500).send({ message: error.message , status:false});
    }
})

courseRoute.put('/:id',adminAuth ,async (req, res) => {
    try {
        const updatedCourse = await courseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) {
            return res.status(404).send({ message: 'Course not found' , status:false });
        }
        res.status(201).send({message:"Course Updated",updatedCourse , status:true});
    } catch (error) {
        res.status(500).send({ message: error.message , status:false});
    }
});

courseRoute.delete('/:id', adminAuth ,async (req, res) => {
    try {
        const deletedCourse = await courseModel.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).send({ message: 'Course not found', status:false });
        }
        await lectureModel.deleteMany({ course: req.params.id });
        await userModel.updateMany({}, { $pull: { course: req.params.id } });
        res.status(201).send({ message: 'Course deleted successfully' , status:true});
    } catch (error) {
        res.status(500).send({ message: error.message , status:false});
    }
});


module.exports={courseRoute}