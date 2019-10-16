const express = require('express');
const helemt = require("helmet")
const config = require("config")
const Joi = require('@hapi/joi')
const log = require("./logger")
const auth = require("./auth")
const morgan = require("morgan")
const app = express()
// console.log(`NODE_ENV : ${process.env.NODE_ENV}`);

//Cofiguration
console.log(`App Name: ${config.get("name")}`)
console.log(`Mail Server: ${config.get("mail.host")}`)

app.use(express.json())
//app.use(morgan('tiny'))
if (app.get("env") === 'development') {
    app.use(morgan("tiny"))
    console.log("morgan is enabled...");

}
console.log(`app:${app.get("env")}`);
//app.use(log)
//app.use(auth)
//app.use(helemt())
app.use(express.static(__dirname + '/public'))
const genres = [{
        id: 1,
        name: 'Action'
    },
    {
        id: 2,
        name: 'Horror'
    },
    {
        id: 3,
        name: 'Romance'
    },
];

app.get('/api/genres', (req, res) => {
    res.send(genres)
})
app.get("/api/genres/:id", (req, res) => {
    const genre = getgenre(req.params.id)
    res.status(200).send(genre)
})
app.delete("/api/genres/:id", (req, res) => {
    const genre = getgenre(req.params.id)
    const index = genres.findIndex(genre)
    genres.splice(index, 1)
    res.send(genre)
})

app.post("/api/genres", (req, res) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(15)
            .required()
    });

    const {
        error
    } = schema.validate({
        name: req.body.name
    })
    if (error) return res.status(400).send(error.details[0].message)
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }
    genres.push(genre)
    res.send(genre)
})
app.put("/api/genres/:id", (req, res) => {
    const genre = getgenre(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given ID was not found.')
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(15)
            .required()
    });

    const {
        error
    } = schema.validate({
        name: req.body.name
    })
    if (error) return res.status(400).send(error.details[0].message)
    genre.name = req.body.name
    res.send(genre)
})

function getgenre(id) {

    return genres.find(g => g.id === parseInt(id))
}
app.listen(3000, () => console.log("Server is running on the port 3000"))