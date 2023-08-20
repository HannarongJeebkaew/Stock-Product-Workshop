
const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    nameProduct:{
        type:String,
        require:true
    },price:{
        type:Number,
        require:true
    },weight:{
        type:Number,
        require:true
    },typeWeight:{
        type:String,
        require:true
    }
})
module.exports = mongoose.model('product',productSchema)