require("dotenv").config();
const express = require("express");
const app = express();
var morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
//const mongoose = require("mongoose")
// eslint-disable-next-line no-unused-vars
morgan.token("payload", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :payload"
  )
);

app.get("/", (req, res) => {
  res.send("<h1>Working</h1>");
});

app.get("/api/persons", (req, res) => {
  //Responds with total persons list
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res, next) => {
  //show time request was recieved and number of entries at time of request
  var date = new Date();
  Person.find({})
    .countDocuments((err, count) => {
      return count;
    })
    .then((count) => {
      res.send(`<div>Phonebook has info for ${count}</div>
    <div>${date}</div>`);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res
          .status(400)
          .send({
            error:
              "That entry has already been deleted. Please refresh page to get updated number list",
          });
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (req, res, next) => {
  //Name or number is missing
  //Assume multiple entries may contain the same name.
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({ error: "Incomplete entry." });
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * 10000),
    });

    person
      .save()
      .then((savedPerson) => {
        res.json(savedPerson);
      })
      .catch((error) => next(error));
  }
});

app.put("/api/persons/:id", (req, res, next) => {
  //Assume not doing this at this time.
  //This should *ideally* update existing entries of the same name
  //changeName request handled in frontend
  const person = {
    name: req.body.name,
    number: req.body.number,
  };
  //console.log(person)
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unkown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
