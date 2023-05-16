const mongoose = require("mongoose")

const Task = mongoose.model("Task" , {
    job : {
        type        :     String ,
        required    :     true ,
        trim        :     true
    } ,
    description : {
        type        :     String ,
        required    :     true ,
        trim        :     true
    } ,    
    
    place : {
        type        :     String ,
        required    :     true ,
        trim        :     true
    } ,   
    owner : {
        type        :     mongoose.Schema.Types.ObjectId ,
        required    :     true 
    } ,
})
module.exports = Task