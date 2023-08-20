const express = require('express')
const cors = require('cors')
const bodyParse =require('body-parser')
const morgan = require('morgan')
const {readdirSync} =require('fs')
const connectDB =  require('./configs/db')
const app=express();
connectDB();
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParse.json({limit:"10mb"}))

readdirSync('./Routes').map((r)=>{
    app.use("/api",require('./Routes/'+r))
})
app.listen(5000,()=>{
    console.log("Server run in port 5000");
})