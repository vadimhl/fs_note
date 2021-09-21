const express = require('express');
//const morgan = require('morgan');
const app = express();
const cors = require('cors');


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

//morgan.token('jsonpost', function (req, res) { 
//    return JSON.stringify(req.body); 
//})
app.use(express.json());
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jsonpost',
//{immediate:true}));
//app.use(morgan(':status :res[content-length] - :response-time ms :jsonpost'));
app.use(express.static('build'));
app.use(cors());

app.get( '/api/persons', (req, resp) => {
    resp.json(persons);
})

app.get( '/info', (req, resp) => {
    resp.send(`<div>Phonebook has info for ${persons.length} people.</div><br />
    <div>${new Date()}</div>`)
})

app.get('/api/persons/:id', (req, resp) => {
    const id = Number(req.params.id);
    const person = persons.find( (p => p.id === id));
    if ( person ) {
        return resp.json(person);
    } else {
        return resp.status(404).send(`<h1>${id} - not found</h1>`);
    }
})

app.delete('/api/persons/:id', (req, resp) => {
    const id = Number(req.params.id);
    persons = persons.filter( p => p.id !== id);
    resp.status(204).end();
})

app.post('/api/persons', (req, resp) => {
    let person = req.body;
    if (!person.name) {
        return resp.status(400).json({error:'name missing'})
    }
    if (!person.number) {
        return resp.status(400).json({error:'number missing'})
    }
    if ( persons.find( p => p.name === person.name)) {
        return resp.status(400).json({error:`${person.name} already exist`})
    }
    person.id = Math.trunc(Math.random()*10000);
    
    persons.push(person);
    
    resp.json(person);

})

const PORT = process.env.PORT || 3000;
app.listen( PORT, () => (console.log('Listen on port ', PORT)));
