const mongoose = require("mongoose")

const TaskSchema = mongoose.Schema({
    taskName:{
        type: String,
        require: true,
        trim: true
    },
    state:{
        type: Boolean,
        default: false
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }
})

module.exports = mongoose.model("Task", TaskSchema)