const mongoose = require('mongoose')

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

module.exports = Task

// const mongoose = require('mongoose')

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// router.post("/", auth, async (req, res) => {
//     try {
//       const type = req.body.type; 
//       const info = req.body.info;
//       var date=req.body.due_date;
//       const assignedto=req.body.assignedto;
//       const iscompleted = req.body.iscompleted;
//       var today = new Date();
//       var dat = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//         date=new Date(date)
//         dat=new Date(dat)
//         if(date.getTime()<dat.getTime()){
//           res.status(500).send("Please Select future time");
//         return
//         }
//       if(iscompleted != "Completed" && iscompleted!="Not Completed"){
//         res.status(500).send("Not in Proper Form");
//         return
//       }
      