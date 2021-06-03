// Projects data Models

const mongoose = require('mongoose'); 

const projectSchema = new mongoose.Schema({
    projId: {
        type: String,
        
    },
    projName: {
        type: String,
        required: true
    },
    projStatus: {
        type: String,
        required: true
    },
    projOwner: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    catagory: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    managerName: {
        type: String,
        required: true
    },
    clientPhone: {
        type: String,
        required: true
    }
});

const Project = mongoose.model("project", projectSchema);

module.exports= Project;