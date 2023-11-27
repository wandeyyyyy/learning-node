const Joi = require('joi');
const config = require('config');
const logger = require('./logger');
const login = require('./login');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const startupDebugger = require('debug') ('app:startup');
const dbDebugger = require('debug') ('app:db');




// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());




if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
startupDebugger('Morgan Enabled...')
}

app.use(login);
app.use(logger);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);
dbDebugger('connected to database...')



const courses = [
    {id: 1, name:"html"},
    {id: 2, name:"css"},
    {id: 3, name:"javascript"}
]
console.log('Application Name' + config.get('name'));
// console.log('Mail Server '+ config.get('mail.host'));
console.log('Mail Password'+ config.get('mail.password'));


// to get all courses
app.get("/api/courses", (req, res) =>
{
    res.send(courses)
}); 


// to get a course using id
app.get("/api/courses/:id",(req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("the course with the id not found");
    res.send(course)
})
 

// to create or add a course
app.post('/api/courses', (req, res) => {
    // const schema = {
    //     name: Joi.string().min(3).required()
    // }
    // const result = Joi.validate(req.body,schema)
    // console.log(result)
    // if(result.error) {
    //     res.status(400).send(result.error.details[0].message)
    //     return;
    // }
    const { error } = validateCourse(req.body)


    if(error) return res.status(400).send(error.details[0].message);
  
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course)

})


// to update a course 
app.put('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('the course with the id not found');


    course.name = req.body.name;
    res.send(course)
})


// to delete a course 
 app.delete('/api/courses/:id', (req, res) => {
const course = courses.find(c => c.id === 
parseInt(req.params.id));
if (!course) return res.status(404).send('the course with the id not found');
const index = courses.indexOf(course);
courses.splice(index, 1);
res.send(course)
})

function validateCourse(course) {
    const schema = {
      name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema)
}
 
const port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`listening on port ${port}...`)})