import React from "react";

export default function Header() {
  return (
    <header>
      <div class="container text-center">
        <div class="row align-items-center">
          <div class="col-md-7 col-sm-12 text-white" data-aos="fade-right">
            <h1>Novelia</h1>
            <p>An inclusive novels reading and writing website</p>
          </div>
          <div class="col-md-5 col-sm-12 h-25" data-aos="fade-up">
            <img src="/media/Group 4.svg" alt="Book" />
          </div>
        </div>
      </div>
    </header>
  );
}
