const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const url = "mongodb+srv://fullstack:numbers28@cluster0.fecvp.mongodb.net/person?retryWrites=true&w=majority";

console.log("connecting to", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true, minlength: 3},
  number: {type: String, required: true, minlength: 8},
  id: Number
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Person", personSchema);
