import React from 'react'
import "./About.css"
import img2 from "../../assets/Home2.jpeg"
import img3 from "../../assets/home3.jpg"

function About() {
  return (
    <div id="about">
      <div className="about-container">
        <div className="left-side">
          <p>
            <span className="company-name">Raipur Metaliks</span> is a leading name in the steel and metal industry, 
            committed to delivering top-quality steel and iron products that power
            infrastructure, construction, and industrial growth across India.
          </p>
          <p>
            Headquartered in Raipur — the steel capital of India — we bring
            together state-of-the-art manufacturing facilities, industry expertise
            and a deep-rooted commitment to excellence. Our product range
            includes high-grade TMT bars, structural steel, iron billets, and
            customized metal solutions designed to meet diverse project needs.
          </p>
          <div className="highlight-text">
            <p>
              At <span className="company-name">Raipur Metaliks</span>, quality is our foundation.
              From raw material selection to the final dispatch, every process 
              is optimized to ensure strength, durability, and consistency.
            </p>
          </div>
          <p>
            Driven by innovation and sustainability, we aim to be at the
            forefront of India's industrial transformation building a
            stronger tomorrow, one steel beam at a time.
          </p>
        </div>
        <div className="right-side">
          <div className="image-container">
            <img src={img2} alt="steel production" className="top" />
            <img src={img3} alt="steel factory" className="bottom" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default About