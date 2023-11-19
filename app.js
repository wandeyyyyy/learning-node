const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
// middleware
const courses = [
    {id: 1, name:"html"},
    {id: 2, name:"css"},
    {id: 3, name:"javascript"}
]


// \\\app.get('/api/courses', (req, res) =>
// {
//     res.send([1,2,3])
// });
app.get("/api/courses", (req, res) =>
{
    res.send(courses)
});

app.get("/api/courses/:id",(req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send("the course with the id not found");
    res.send(course)
})

app.post('/api/courses', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required()
    }
    const result = Joi.validate(req.body,schema)
    console.log(result)
    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course)

})

app.put('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('the course with the id not found');
    const schema = {
        name: Joi.string().min(3).required()
    }
    const result = Joi.validate(req.body,schema)
    console.log(result)
    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return;
    }
    course.name = req.body.name;
    res.send(course)
})
const port = process.env.PORT || 2000;

app.listen(port, () => {console.log(`listening on port ${port}...`)})