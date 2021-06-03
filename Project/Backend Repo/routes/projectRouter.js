const router = require("express").Router();
const Project = require("../models/projectModel");
const auth = require("../middleware/auth");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });
// upload.single("logo")
// Create Project
router.put("/", async(req,res) => {
    try{
        let {
            projId,
            projName,
            projStatus,
            projOwner,
            email,
            catagory,
            logo,
            managerName,
            clientPhone        
        } = req.body;
        // let logo = req.file.filename

        const newProject = new Project({
            projId,
            projName,
            projStatus,
            projOwner,
            email,
            catagory,
            logo,
            managerName,
            clientPhone
        });

        console.log("logo : "+ newProject.logo);

        // Validation
       if(!projId ||
            !projName ||
            !projStatus ||
            !projOwner ||
            !email ||
            !catagory ||
            !logo ||
            !managerName ||
            !clientPhone
        ){
           return res
            .status(400)
            .json({errorMessage: "Please enter required fields."});
       }

        const saveProject = await newProject.save();
        res.json(saveProject);
    }
    catch(err){
        console.error(err);
        res.status(500).send();
    }
});

// Get all the projects
router.get("/", async (req,res) => {

    try{
        const projects = await Project.find();
        res.json(projects);
    }
    catch(err){
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;