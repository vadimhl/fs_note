//const { response, request } = require('express')
const { request, response } = require('express');
const express = require('express')
const app = express();

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
]

const generateId = () => (persons.length == 0 ? 0: Math.max(...persons.map(n=>n.id) ) )+1;

app.use(express.json());

const logger1 = ( request, response, next) => {
  console.log('log 1');
  next();
}

const logger2 = ( request, response, next) => {
  console.log('log 2');
  next();
}
const logger3 = ( request, response, next) => {
  console.log('log 3');
  next();
}
const logger4 = ( request, response, next) => {
  console.log('log 4');
  next();
}

app.use(logger1);

app.get('/info', (request, response) => {
  response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <br />
    <div>${new Date()}</div>
  `)
})
app.use(logger2);
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('persons id=', id);
    const person = persons.find( p => p.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })
  app.use(logger3);  
  app.delete('/api/persons/:id', (request, response) => {
      const id = Number(request.params.id);
      persons = persons.filter ( p => p.id !== id);
      response.status(204).end();
  })
  
  app.get('/api/persons', (request, response) => {
    console.log('persons');
    response.json(persons)
  })
  
  app.post('/api/persons/', (request, response) => {
    const body = request.body;
    
    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    }
    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    const person = {
        name: body.name,
        number: body.number,
        //date: new Date(),
        id: generateId(),
    }
    
    persons =  persons.concat( person);
    
    response.json( person);
  })
  app.use(logger4);
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })