import React from "react";

const PersonForm = ({addName,handleNameChange,handleNumberChange, newName, newNumber}) => {
  
  return (
    <form onSubmit={addName}>
      <div>
        name:{""}
        <input
          type="text"
          value={newName}
          onChange={handleNameChange}
          required
        />
      </div>
      <div>
        number:{""}
        <input
          type="tel"
          value={newNumber}
          onChange={handleNumberChange}
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          required
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
