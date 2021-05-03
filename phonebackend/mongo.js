/* eslint-disable no-undef */
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide the password as an argument: node mongo.js <password>");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3] ? process.argv[3] : false;
const number = process.argv[4] ? process.argv[4] : false;
//console.log(name, number)
const url =
  `mongodb+srv://fullstack:${password}@cluster0.fecvp.mongodb.net/person?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
});
personSchema.set("toJSON", {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString();
    delete retObj._id;
    delete retObj.__v;
  }
});

const Person = mongoose.model("Person", personSchema);

if (name || number) {
  //at this point, assume if one option is true, both are
  //assume input is clean: no duplicate names/updating existing names
  const person = new Person({
    name: name,
    number: number,
    id: Math.floor(Math.random()*10000)
  });
  // eslint-disable-next-line no-unused-vars
  person.save().then(result => {
    console.log("person saved!");
    mongoose.connection.close();
  });
} else {
  //prints 'phonebook: ' followed by all entries {name, number}
  //access mongodb
  console.log("phonebook:");
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}


//const person = new personSchema({

//})

////////////////////////////////////////////////

/* const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
}) */

