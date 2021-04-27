import React, { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import personService from "./services/persons";
import Notification from './components/Notification'
import './index.css'

//<div>debug: {newName}</div> - temporarily added to rendered component to help debup passing state and other variables

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState(""); //for controlling the form input method
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialList) => {
      setPersons(initialList);
    });
  }, []);

  //console.log("render", persons.length, "people");

  const addName = (e) => {
    e.preventDefault();
    const personsObj = {
      name: newName,
      number: newNumber,
    };
    //eslint-disable-next-line
    if (persons.every((x) => x.name != personsObj.name)) {
      //2.15 Adding number to db.json. Will use personService in next exercise
      personService.addEntry(personsObj).then((response) => {
        console.log(response);
        setPersons(persons.concat(response));
        setErrorMessage(`${response.name} has been added.`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      });
    } else {
      const existPerson = persons.filter(x=>x.name===personsObj.name)
      personService
        .changeNumber(existPerson[0], newNumber)
        .then(response=>{
          setPersons(persons.map(x=>x.id===response.id ? response : x))
          setErrorMessage(`${response.name}'s entry has been updated.`)
          setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
        });
    }
    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (e) => {
    //console.log(e.target.value)
    setNewName(e.target.value);
  };
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const handleDelete = (id) => {
    const result = window.confirm(`Delete ${persons[persons.findIndex(x=>x.id===id)].name}?`);
    if (result) {
      personService
        .delEntry(id)
        .then((response) => {
          console.log(response);
          setPersons(persons.filter((x) => id !== x.id));
        })
        .catch((error)=>{
          setErrorMessage(`Information of ${persons[persons.findIndex(x=>x.id===id)].name} has already been removed from the server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
          console.log(`Information of ${persons[persons.findIndex(x=>x.id===id)].name} has already been removed from the server`)
          personService.getAll().then((initialList) => {
            setPersons(initialList);
          });
        })
    } else {
      console.log(`${id} not deleted per user confirmation.`);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>add a new</h2>
      <PersonForm
        addName={addName}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
