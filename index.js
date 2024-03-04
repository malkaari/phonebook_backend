/* eslint-disable @stylistic/js/linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @stylistic/js/linebreak-style */
/* eslint-disable @stylistic/js/indent */
/* eslint-disable @stylistic/js/linebreak-style */
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')
// const mongoose = require('mongoose')
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))
// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  let len = Person.count()
  const d = new Date()
  // response.send(`<h1>Phonebook has info for ${len} people<h1>
  //                <h1>${d}<h1>`)
  response.send(`<h1>Phonebook has info for ${len} people </br> ${d}<h1>`)
})
// app.get('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const person = persons.find(p => p.id === id)
  
//   if (person) {
//     response.json(person)
//   } else {
//     response.status(404).end()
//   }
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter(p => p.id !== id)

//   response.status(204).end()
// })
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    // eslint-disable-next-line no-unused-vars
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
// const generateId = () => {
//   return Math.floor(Math.random() * 100000)
// }
app.post('/api/persons', (request, response,next) => {
  const body = request.body

  // if (!body.number) {
  //   return response.status(400).json({ 
  //     error: 'number is  missing' 
  //   })
  // }
  // if (persons.find(p => p.name === body.name) ) {
  //   return response.status(400).json({ 
  //     error: 'name must be unique' 
  //   })
  // }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    content: body.name,
    important: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
  } 

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
