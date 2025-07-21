import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',  
    subject: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    
    try {
      const contactDto = {
        ...formData,
        phoneNo: formData.phoneNo ? parseInt(formData.phoneNo, 10) : null
      };
      
      const response = await fetch('http://raipurmetaliksbe-production.up.railway.app:8080/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactDto)
      });
      
      if (!response.ok) {
        throw new Error('Server responded with status: ${response.status}');
      }
      
      const data = await response.json();
      console.log('Success:', data);
      setFormSubmitted(true);
      
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phoneNo: '',
          subject: '',
          message: ''
        });
        setFormSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Failed to submit form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h2>Contact Us</h2>
          <p>Get in touch with our team for inquiries and support</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon">
                <i className="icon-location">📍</i>
              </div>
              <div className="info-details">
                <h3>Our Location</h3>
                <p>Industrial Area, Phase II<br />Raipur, Chhattisgarh 492001<br />India</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="icon-phone">📞</i>
              </div>
              <div className="info-details">
                <h3>Call Us</h3>
                <p>+91 771 123 4567<br />Mon-Sat 9:00 AM - 6:00 PM</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="icon-email">✉</i>
              </div>
              <div className="info-details">
                <h3>Email Us</h3>
                <p>info@raipurmetaliks.com<br />sales@raipurmetaliks.com</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            {formSubmitted ? (
              <div className="form-success">
                <div className="success-icon">✓</div>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phoneNo">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phoneNo" 
                      name="phoneNo" 
                      value={formData.phoneNo}
                      onChange={handleChange}
                      placeholder="e.g., 9876543210"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                {submitError && <div className="error-message">{submitError}</div>}
                
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
