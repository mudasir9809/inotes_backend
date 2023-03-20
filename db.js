const mongoose = require('mongoose')
let uri ='mongodb+srv://rogue2:rogue4554@cluster0.e24lw6l.mongodb.net/?retryWrites=true&w=majority'

const connectToMongo =()=>{
    mongoose.connect(uri,()=>{
        console.log('connected successfully')
    })
}


module.exports = connectToMongo