const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Person = require('./models/Person');


morgan.token('jsonpost', function (req, res) { 
    return JSON.stringify(req.body); 
})
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jsonpost',
{immediate:true}));
app.use(morgan(':status :res[content-length] - :response-time ms :jsonpost'));
app.use(express.static('build'));
app.use(cors());

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  resp.status(400).json({ error: error.name, errMsg: error.message });
}

/*app.get( '/info', (req, resp) => {
    resp.send(`<div>Phonebook has info for ${persons.length} people.</div><br />
    <div>${new Date()}</div>`)
})*/

app.get( '/api/persons', (req, resp) => {
    Person.find({}).then( persons => {
      resp.json(persons);
    });
})

app.post('/api/persons', (req, resp) => {

    if (!req.body.name) {
        return resp.status(400).json({error:'name missing'})
    }
    if (!req.body.number) {
        return resp.status(400).json({error:'number missing'})
    }
    //if ( persons.find( p => p.name === person.name)) {
    //  return resp.status(400).json({error:`${person.name} already exist`})
    //}
    
    const person = new Person ({
      name: req.body.name,
      number: req.body.number,
    })
    person.save().then( savedPerson => resp.json(savedPerson));
    
})
app.delete('/api/persons/:id', (req, resp, next) => {
    console.log(`id=${req.params.id}`);
    Person.findByIdAndRemove(req.params.id)
    .then( () => resp.status(204).end() )
    .catch( error => next(error) )
})
app.get('/api/persons/:id', (req, resp, next) => {
  
    Person.findById(req.params.id)
      .then( person => {
        if (person) {
          resp.json(person) 
        } else {
          resp.status(404).json({error: 'not found', errMsg: error.message});
        }
      })
      .catch( error => next(error));
 })

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen( PORT, () => (console.log('Listen on port ', PORT)));
