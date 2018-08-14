/*
This file is of no use as of now
but may be useful in the future


*/


"use strict";

const express = require("express");
const router = express.Router();

app.get('/',function(req,res){
    res.send('Hello');
});
app.post('/',(req,res)=>{
   res.json({ response: `working get ${req.body.name}`, id: req.params.name });
});
module.exports = router;