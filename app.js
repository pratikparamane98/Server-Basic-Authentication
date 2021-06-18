const express = require('express')
const indexRoutes = require('./routes/index.js')
const userRoutes = require('./routes/users.js')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')//when we need to show message after redirect we use flash,it stores the message in the session and shows it after the redirect
const session = require('express-session')
const passport = require('passport');


const app = express()

//passport config
require('./config/passport')(passport)

const PORT = 5000



const db = 'mongodb://localhost/auth';

mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>{
    console.log("connection successfull");
}).catch(()=>{
    console.log("not successfulll")
})

//EJS
app.use(expressLayouts)
app.set('view engine','ejs')

//bodyparser
app.use(express.urlencoded({extended:false}))

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());  

//connect flash
app.use(flash())  

//Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

//Routes
app.use('/',indexRoutes)
app.use('/users',userRoutes)


app.listen(PORT,()=>{
    console.log("connection succesfulll")
})