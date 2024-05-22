import React from 'react'
import './Landingcard.css'

const Landingcard = (props) => {
  const {name,parent,Count,description} = props 
  return (
    <>
    <div className="card text-bg-info mb-3 card-costum">
      <div className="card-header">Count of {name}</div>
      <div className="card-body">
        <h5 className="card-title">{Count}</h5>
        <p className="card-text">
          {description}
        </p>
      </div>
    </div>
    </>
  );
}

export default Landingcard
