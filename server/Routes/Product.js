const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controllers/product')
router.post('/product',create)
router.put('/product/:id',update)
router.get('/product',list)
router.delete('/product/:id',remove)
module.exports =  router