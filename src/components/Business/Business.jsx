import React from 'react'
import "./Business.css"
import Billet from "../../assets/Billet.avif"
import coal from "../../assets/ccoal.jpg"
import iron_ore_fines from "../../assets/iof.webp"
import iop from "../../assets/iron-ore-pellets.jpg"
import pig from "../../assets/pigIron.jpg"
import silico from "../../assets/silico.jpeg"
import si from "../../assets/spongeiron.avif"

function Business() {
  return (
    <div id="business">
        <div className="Billet">
          <img src={Billet} alt="billet" />
          <p className="des">
            Description: Semi-finished product from casting or rolling steel.<br></br>
            Shape: Rectangular or square cross-section.<br></br>
            Size: Typically 100x100 mm or 150x150 mm.<br></br>
            Use: Raw material for rolling into bars, rods, and other long products.
          </p>
        </div>
        <div className="Coal">
          <img src={coal} alt="Coal" />
          <p className="des">
            Description: A carbon-rich sedimentary rock used as fuel.<br></br>
            Types Used in Metallurgy: Mainly Coking Coal (used in blast furnaces) and Non-coking <br></br>
            Fixed Carbon Content: ~60–85% (for coking coal).<br></br>
            Use: Reducing agent in iron-making, especially in blast furnaces and coke ovens.
          </p>
        </div>
        <div className="Iron Ore Fines">
          <img src={iron_ore_fines} alt="Iron ore Fines" />
          <p className="des">
            Description: Crushed and ground iron ore particles that are too fine for direct use in a blast furnace. <br></br>
            Size: 11 mm or more.<br></br>
            Iron Content: ~58–64%.<br></br>
            Use: Processed into pellets or sinter before use in steel production.
          </p>
        </div>
        <div className="Iron Ore Pellet">
          <img src={iop} alt="iop" />
          <p className="des">
            Description: Spherical balls made from iron ore fines with additives like bentonite and limestone, hardened by heat.<br></br>
            Size: 8–18 mm diameter.<br></br>
            Iron Content: ~63–68%.<br></br>
            Use: Used in blast furnaces and direct reduction processes to produce steel due to better permeability and uniformity.
          </p>
        </div>
        <div className="Pig Iron">
          <img src={pig} alt="pig iron" />
          <p className="des">
            Description: Crude iron from a blast furnace, with high carbon content.<br></br>
            Carbon Content: ~3.5–4.5%.<br></br>
            Types: Basic, Foundry, and High-Phosphorus Pig Iron.<br></br>
            Use: Intermediate product used to make steel or cast iron products.
          </p>
        </div>
        <div className="Silico Manganese">
          <img src={silico} alt="silico" />
          <p className="des">
            Description: Ferroalloy composed of manganese, silicon, and iron.<br></br>
            Composition: ~60–70% Mn, 14–18% Si.<br></br>
            Use: Deoxidizer and alloying element in steelmaking to improve strength, toughness, and wear resistance.
          </p>
        </div>
        <div className="Sponge Iron">
          <img src={si} alt="si" />
          <p className="des">
            Description: Iron produced by reducing iron ore using gas or non-coking coal without melting.<br></br>
            Form: Porous solid.<br></br>
            Iron Content: ~90–94%.<br></br>
            Use: Raw material for electric arc furnaces and induction furnaces in steel making.
          </p>
        </div>
    </div>
    
  )
}

export default Business
