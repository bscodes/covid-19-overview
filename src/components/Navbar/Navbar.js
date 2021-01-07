import React from 'react'
import { RiVirusFill } from 'react-icons/ri'

const Navbar = () => {
  return(
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h1 className="header-title mt-3 mb-3">
              <RiVirusFill className="pb-2"/> COVID-19 Overview
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;