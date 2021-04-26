const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
morgan.token('payload', (req,res) => {
  return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'))

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/', (req,res) => {
  res.send('<h1>Working</h1>')
})

app.get('/api/persons', (req,res) => {
  //Responds with total persons list
  res.json(persons)
  console.log(`All persons sent`)
})

app.get('/info', (req,res) => {
  //show time request was recieved and number of entries at time of request
  const date = new Date()
  const entries = persons.length
  //console.log(`${date} and ${entries} entries.`)
  res.send(
    `<div>Phonebook has info for ${entries}</div><div>${date}</div>`
    )
})

app.get('/api/persons/:id', (req,res) => {
  //Convert string to number
  const id = Number(req.params.id)
  //console.log(`GET request of ${id}`)
  //Object boolean for id existence in persons
  const exist = persons.find(x=>x.id===id)

  if (exist) {
    res.json(exist)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  //console.log(`DELETE request of ${id}`)
  persons = persons.filter(x=>x.id!=id)
  res.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random()*100000)
  while (!persons.every(x=>x.id!==id)) {
    id = Math.floor(Math.random()*100000)
  }
  return id
}

app.post('/api/persons', (req, res) => {
  //console.log(req.body)
  //console.log(req.body.name)
  //console.log(req.body.number)
  //Name or number is missing
  //Name already exists
  if (!req.body.name) {
    res.status(400).json({error: 'Blank name entry.'})
  } else if (!req.body.number) {
    res.status(400).json({error: 'Blank number entry.'})
  } else if (persons.filter(x=>x.name===req.body.name).length >= 1) {
    //Updates phone number
    person = {...req.body}
    persons[persons.indexOf(person)] = persons.filter(x=>x.name===req.body.name)
    res.json(person)
  } else {
    person = {...req.body, 'id': generateId()}
    persons = persons.concat(person)
    res.json(person)
  }
})

app.put('/api/persons/:id', (req, res) => {
  id = Number(req.params.id)
  person = {...req.body}
  persons[persons.indexOf[person.id]] = person
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})