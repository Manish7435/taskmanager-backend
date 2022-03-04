import mongoose from 'mongoose'

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    assignedTo:{
        type: String,
        required: true
    },
    dueDate:{
        type: String
        // required:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'

    }
})

export default Task

