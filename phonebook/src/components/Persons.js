import React from 'react';

const DeleteButton = ({id , handleDelete}) => {
  return (
    <button name={id} type='button' onClick={()=>handleDelete(id)}>
      delete
    </button>
  )
}

const Persons = ({ persons, filter, handleDelete }) => {
  const regexp = new RegExp(filter, "i");
  const newArr = persons.filter((x) => regexp.test(x.name));
  if (filter) {
    return (
      <>
        {newArr.map((x) => (
          <div key={x.name}>
            {x.name} {x.number} <DeleteButton id={x.id} handleDelete={handleDelete} />
          </div>
        ))}
      </>
    );
  } else {
    return (
      <>
        {persons.map((x) => (
          <div key={x.name}>
            {x.name} {x.number} <DeleteButton id={x.id} handleDelete={handleDelete}/>
          </div>
        ))}
      </>
    );
}}

export default Persons