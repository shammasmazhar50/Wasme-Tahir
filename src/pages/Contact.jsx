import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './Contact.css';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  viewport: { once: true }
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiry: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would handle form submission here
    alert('Form submitted! (This is a demo)');
  };

  return (
    <motion.div 
      className="contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <section className="contact-section">
          
          <div className="contact-info">
            <motion.h1 className="heading-lg" {...fadeUp}>
              Let's create something worth remembering.
            </motion.h1>
            
            <motion.div className="contact-categories" {...fadeUp} transition={{ delay: 0.2 }}>
              <span className="subheading">AVAILABLE FOR</span>
              <ul>
                <li>Brand Partnerships</li>
                <li>PR & Media</li>
                <li>Fashion & Editorial</li>
                <li>Events & Appearances</li>
                <li>Campaigns</li>
                <li>Creative Projects</li>
              </ul>
            </motion.div>
            
            <motion.div className="direct-email" {...fadeUp} transition={{ delay: 0.3 }}>
              <span className="subheading">DIRECT INQUIRIES</span>
              <a href="mailto:contact@wasmetahir.com">contact@wasmetahir.com</a>
            </motion.div>
          </div>

          <motion.div className="contact-form-wrapper" {...fadeUp} transition={{ delay: 0.4 }}>
            <form className="contact-form" onSubmit={handleSubmit}>
              
              <div className="form-group">
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Name" 
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="Email" 
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="text" 
                  name="company" 
                  value={formData.company} 
                  onChange={handleChange} 
                  placeholder="Company / Publication" 
                />
              </div>
              
              <div className="form-group">
                <select 
                  name="inquiry" 
                  value={formData.inquiry} 
                  onChange={handleChange} 
                  required
                >
                  <option value="" disabled>Type of Inquiry</option>
                  <option value="brand">Brand Partnership</option>
                  <option value="press">Press / Media</option>
                  <option value="event">Event / Appearance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  placeholder="Message" 
                  rows="4"
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">
                Send Message <ArrowRight size={16} />
              </button>
              
            </form>
          </motion.div>

        </section>
      </div>
    </motion.div>
  );
};

export default Contact;
