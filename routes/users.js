const express = require('express')
const router = express.Router()
const User = require('../models/User.js')
const bcrypt = require('bcryptjs')
const passport = require('passport');


//login page
router.get('/login',(req,res)=>res.render("login"))

//Register page
router.get('/register',(req,res)=>res.render("register"))

//Register Handle
router.post('/register',(req,res)=>{
    const {name,email,password,password2} = req.body
    let errors = []

    //check required fields
    if(!name||!email||!password||!password2){ //this ensures that if any field is empty it will display following message
        errors.push({msg:"Please fill all the fields"})
    }

    //check passwords match
    if(password!==password2){
        errors.push({msg:"Passwords do not match"})
    }

    //check password length
    if(password.length<6){
        errors.push({msg:"Passwords should be atleast 6 characters"})
    }

    if(errors.length>0){        //if there are errors it will rerender the register page but also it will keep the entered details
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }else {
        //validation passed
        User.findOne({email: email})
        .then(user=>{
            if(user){
                //user exists
                errors.push({msg:"Email is already registered"})                
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }else {
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                })
                console.log(newUser)
                // res.send("passed")
                bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    
                    //set password to hashed
                    newUser.password = hash
                    //save user
                    newUser.save()
                    .then(user=>{
                        req.flash('success_msg',"You are now registered")
                        res.redirect('/users/login')
                    })
                    .catch(err=>console.log(err))
                }))
            }
        })
    }
    console.log(errors)

})
//Login handle
router.post('/login',function(req,res,next){
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
})
//Logout handle
router.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/users/login')
})

module.exports = router