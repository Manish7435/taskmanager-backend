import {Schema, model} from 'mongoose'

interface Task {
    description: string;
    isCompleted: Boolean,
    assignedTo: string,
    dueDate: string,
    owner: any
  }

const schema = new Schema<Task>({
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

const Task = model('Task', schema)



export default Task

