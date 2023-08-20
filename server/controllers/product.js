const Product = require('../models/products')
exports.list = async(req,res)=>{
    try{
        const product = await Product.find()
        res.send(product)
    }catch(err){
        console.log(err);
    }
}
exports.create = async(req,res)=>{
    try{
        console.log(req.body);
        const product = await Product(req.body).save()
        res.send(product)
    }catch(err){
        console.log(err);
    }
}
exports.update = async(req,res)=>{
    try{
        console.log(req.params.id);
        console.log(req.body);

        const product = await Product.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
        res.send(product)
    }catch(err){
        console.log(err);
    }
}
exports.remove = async(req,res)=>{
    try{
        console.log(req.params.id);
        const product = await Product.findOneAndDelete({_id:req.params.id})
        res.send(product)
    }catch(err){
        console.log(err);
    }
}