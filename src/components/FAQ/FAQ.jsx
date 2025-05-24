import React, { useState } from 'react';
import './FAQ.css';

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "What types of steel products does Raipur Metaliks offer?",
      answer: "Raipur Metaliks offers a wide range of steel and iron products including high-grade TMT bars, structural steel, iron billets, and customized metal solutions designed for various construction and industrial applications. Our products meet industry standards for strength, durability, and consistency."
    },
    {
      question: "What are the quality standards followed by your company?",
      answer: "At Raipur Metaliks, we adhere to the highest quality standards in the industry. Our manufacturing processes follow ISO 9001:2015 certification guidelines, and our products comply with BIS (Bureau of Indian Standards) specifications. Every batch undergoes rigorous testing for tensile strength, yield strength, elongation, and chemical composition."
    },
    {
      question: "Do you offer customized steel solutions?",
      answer: "Yes, we specialize in providing customized steel solutions tailored to meet specific project requirements. Our team of metallurgists and engineers works closely with clients to understand their needs and develop products with precise specifications, dimensions, and performance characteristics."
    },
    {
      question: "What is the minimum order quantity?",
      answer: "Our minimum order quantity varies depending on the product type and specifications. For standard products, we typically have a minimum order of 5 metric tons, while customized products may have different requirements. Please contact our sales team for specific information related to your needs."
    },
    {
      question: "How do you ensure sustainability in your operations?",
      answer: "Sustainability is a core value at Raipur Metaliks. We implement energy-efficient manufacturing processes, utilize scrap metal recycling, and have installed pollution control equipment that exceeds regulatory requirements. Our facility uses water recycling systems and we continuously work to reduce our carbon footprint through process optimization."
    },
    {
      question: "What are your delivery timeframes?",
      answer: "Delivery timeframes depend on the product type, quantity, and your location. Typically, standard products are delivered within 7-14 business days after order confirmation. Custom orders may require 14-21 days or more depending on complexity. We also offer expedited delivery options for urgent requirements at additional cost."
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div id="faq">
      <div className="faq-container">
        <div className="faq-header">
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common questions about our products and services</p>
        </div>
        
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleAccordion(index)}
              >
                <h3>{item.question}</h3>
                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
              </div>
              <div className={`faq-answer ${activeIndex === index ? 'open' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="faq-contact">
          <h3>Still have questions?</h3>
          <p>If you couldn't find the answer to your question, please feel free to contact our support team.</p>
          <button className="contact-btn">Contact Us</button>
        </div>
      </div>
    </div>
  );
}

export default FAQ;