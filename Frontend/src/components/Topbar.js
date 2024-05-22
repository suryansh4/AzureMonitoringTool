import React from 'react'
import './Topbar.css'
import Topimage from '../img/topimg.png'

const Topbar = () => {
  return (
    <div className="topbar">
      <div className='topimg'>
        <img
          className="topimage"
          src={Topimage}
          alt="Top Image"
        />
      </div>
      <div className="header-heading">Azure Monitoring Tool</div>
    </div>
  );
}

export default Topbar
