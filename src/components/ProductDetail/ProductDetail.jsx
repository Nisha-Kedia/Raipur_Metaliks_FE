import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

// Import all the product images
import Billet from "../../assets/Billet.avif";
import coal from "../../assets/ccoal.jpg";
import iron_ore_fines from "../../assets/iof.webp";
import iop from "../../assets/iron-ore-pellets.jpg";
import pig from "../../assets/pigIron.jpg";
import silico from "../../assets/silico.jpeg";
import si from "../../assets/spongeiron.avif";

function ProductDetail() {
  const { productId } = useParams();
  
  const products = {
    'billet': {
      name: 'Billet',
      image: Billet,
      description: 'Semi-finished product from casting or rolling steel.',
      characteristics: [
        'Rectangular or square cross-section',
        'Typically 100x100 mm or 150x150 mm in cross-section',
        'Lengths vary from 3-12 meters',
        'Carbon content usually between 0.15-0.3%',
        'May contain other alloying elements depending on grade'
      ],
      applications: [
        'Raw material for rolling into bars, rods, wires, and other long products',
        'Used in construction for reinforcing bars (rebar)',
        'Manufacturing of automotive parts',
        'Production of engineering components',
        'Base material for seamless pipe production'
      ],
      productionProcess: 'Billets are produced through continuous casting of molten steel or by rolling ingots. The continuous casting method involves pouring molten steel into a water-cooled copper mold where it solidifies into the billet shape before being cut to length.'
    },
    'coal': {
      name: 'Coking Coal',
      image: coal,
      description: 'A carbon-rich sedimentary rock used as fuel and reducing agent in steel production.',
      characteristics: [
        'Fixed Carbon Content: ~60–85%',
        'Volatile Matter: 15-30%',
        'Ash Content: <10%',
        'Sulfur Content: <1%',
        'Moisture Content: <10%'
      ],
      applications: [
        'Primary reducing agent in blast furnaces',
        'Production of coke for metallurgical processes',
        'Thermal coal varieties used for power generation',
        'Pulverized coal injection (PCI) in blast furnaces',
        'Chemical production and carbon materials'
      ],
      productionProcess: 'Coal is mined from underground mines or open-pit operations. After extraction, it undergoes washing and processing to remove impurities. For metallurgical applications, coking coal is heated in ovens at high temperatures (1000-1100°C) in the absence of oxygen to produce coke.'
    },
    'iron-ore-fines': {
      name: 'Iron Ore Fines',
      image: iron_ore_fines,
      description: 'Crushed and ground iron ore particles that are too fine for direct use in a blast furnace.',
      characteristics: [
        'Size: Up to 11 mm',
        'Iron Content: ~58–64%',
        'Silica Content: 2-8%',
        'Alumina: 1-4%',
        'Phosphorus: <0.1%'
      ],
      applications: [
        'Feedstock for sintering process',
        'Raw material for pelletizing plants',
        'Used in direct reduction processes after agglomeration',
        'Blended with lump ore for improved blast furnace performance',
        'Input for innovative ironmaking technologies'
      ],
      productionProcess: 'Iron ore is mined, crushed, and ground. The finer particles (fines) are separated during screening operations. These fines are then either agglomerated through sintering or pelletizing to create suitable blast furnace feed, or used directly in specific ironmaking processes designed for fines.'
    },
    'iron-ore-pellet': {
      name: 'Iron Ore Pellet',
      image: iop,
      description: 'Spherical balls made from iron ore fines with additives like bentonite and limestone, hardened by heat.',
      characteristics: [
        'Size: 8–18 mm diameter',
        'Iron Content: ~63–68%',
        'Compression Strength: >200 kg/pellet',
        'Porosity: 25-30%',
        'Tumble Index: >90%'
      ],
      applications: [
        'Premium feed for blast furnaces',
        'Primary feed for direct reduction processes',
        'Used in electric arc furnaces when mixed with scrap',
        'Suitable for export due to resistance to degradation during transport',
        'Feed for HYL and Midrex direct reduction technologies'
      ],
      productionProcess: 'Iron ore fines are mixed with binders (typically bentonite), fluxes, and sometimes carbon. This mixture is rolled into green balls, dried, and then fired at temperatures around 1200-1300°C to create hardened pellets with high strength and porosity suitable for ironmaking processes.'
    },
    'pig-iron': {
      name: 'Pig Iron',
      image: pig,
      description: 'Crude iron from a blast furnace, with high carbon content.',
      characteristics: [
        'Carbon Content: ~3.5–4.5%',
        'Silicon: 0.5-3%',
        'Manganese: 0.5-2%',
        'Phosphorus: <0.1% (basic) or >0.1% (foundry)',
        'Sulfur: <0.05%'
      ],
      applications: [
        'Primary raw material for steelmaking',
        'Used in foundries for cast iron products',
        'Production of ductile and grey iron castings',
        'Alloying material in electric arc furnaces',
        'Production of high-quality steel when low in impurities'
      ],
      productionProcess: 'Pig iron is produced in blast furnaces where iron ore, coke, and limestone are charged from the top while hot air is blown from the bottom. The resulting chemical reactions reduce iron oxides to metallic iron, which absorbs carbon and other elements, forming pig iron that is tapped from the furnace.'
    },
    'silico-manganese': {
      name: 'Silico Manganese',
      image: silico,
      description: 'Ferroalloy composed of manganese, silicon, and iron.',
      characteristics: [
        'Manganese Content: ~60–70%',
        'Silicon Content: 14–18%',
        'Carbon: <2%',
        'Phosphorus: <0.3%',
        'Iron: Balance'
      ],
      applications: [
        'Deoxidizer in steelmaking',
        'Alloying element for strength and wear resistance',
        'Production of medium and high carbon steels',
        'Manufacturing of special alloy steels',
        'Input for production of other manganese alloys'
      ],
      productionProcess: 'Silico-manganese is produced in submerged arc furnaces by reducing manganese ore, silica, and iron sources (such as steel scrap) with coke or coal. The process operates at temperatures of 1600-1700°C, resulting in a ferroalloy that combines the benefits of both manganese and silicon for steelmaking.'
    },
    'sponge-iron': {
      name: 'Sponge Iron',
      image: si,
      description: 'Iron produced by reducing iron ore using gas or non-coking coal without melting.',
      characteristics: [
        'Iron Content: ~90–94%',
        'Carbon Content: 0.1-1%',
        'Metallization Degree: >85%',
        'Bulk Density: 1.6-1.9 t/m³',
        'Porous Structure'
      ],
      applications: [
        'Raw material for electric arc furnaces',
        'Feed for induction furnaces in steel making',
        'Production of specialty steels',
        'Substitute for scrap in steelmaking',
        'Manufacturing of iron powder for powder metallurgy'
      ],
      productionProcess: 'Sponge iron (DRI - Direct Reduced Iron) is produced by reducing iron ore below its melting point using either natural gas (gas-based) or non-coking coal (coal-based) as reducing agents. The reduction occurs at temperatures of 800-1050°C, removing oxygen from iron ore while maintaining a solid state, resulting in a porous product that resembles a sponge.'
    }
  };
  
  const product = products[productId];
  
  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find information about this product.</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    );
  }
  
  return (
    <div className="product-detail">
      <div className="product-header">
        <h1>{product.name}</h1>
        <Link to="/" className="back-button">Back to Products</Link>
      </div>
      
      <div className="product-content">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info">
          <div className="product-section">
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>
          
          <div className="product-section">
            <h2>Key Characteristics</h2>
            <ul>
              {product.characteristics.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="product-section">
            <h2>Applications</h2>
            <ul>
              {product.applications.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="product-section">
            <h2>Production Process</h2>
            <p>{product.productionProcess}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;