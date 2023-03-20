const mongoose = require('mongoose')
const { Schema } = mongoose;
const noteSechema = new Schema({
    name:{
        type:String,
        required:true
        
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    pass:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('User', noteSechema)