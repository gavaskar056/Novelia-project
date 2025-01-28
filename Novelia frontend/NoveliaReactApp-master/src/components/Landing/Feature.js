import { faBookOpen, faPen, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function Feature() {
  return ( 
    <div id="feature" class="container text-center text-white feature-container">
      <h2 class="pb-2" >Features</h2>
      <div class="row align-items-center pt-5">
        <div class="col-sm-4">
          <span class="glyphicon glyphicon-off"></span>
          <h4> <FontAwesomeIcon icon={faPen} /> Create</h4>
          <p>Create amazing books</p>
        </div>
        <div class="col-sm-4">
          <h4> <FontAwesomeIcon icon={faVolumeUp} /> Text to Speech</h4>
          <p>Listen to your books </p>
        </div>
        <div class="col-sm-4">
          <span class="glyphicon glyphicon-lock"></span>
          <h4> <FontAwesomeIcon icon={faBookOpen} /> Read</h4>
          <p>Read amazing books</p>
        </div>
      </div>
    </div>    
  );
}

export default Feature;
