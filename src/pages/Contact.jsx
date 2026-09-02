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
  const [status, setStatus] = useState(''); // '', 'loading', 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const formPayload = new FormData(e.target);
    // TODO: The user must replace this with their actual Access Key from https://web3forms.com
    formPayload.append("access_key", "YOUR_ACCESS_KEY_HERE");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formPayload
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', inquiry: '', message: '' });
      } else {
        console.error("Form Error", data);
        setStatus('error');
      }
    } catch (error) {
      console.error("Form Exception", error);
      setStatus('error');
    }
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
            {status === 'success' ? (
              <div className="success-message" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Thank You</h3>
                <p className="body-lg">Your message has been sent successfully. I will get back to you shortly.</p>
                <button onClick={() => setStatus('')} className="submit-btn" style={{ marginTop: '2rem' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>

                {/* Web3Forms Advanced Config */}
                <input type="hidden" name="subject" value="New Contact Inquiry from WasmeTahir.com" />
                <input type="hidden" name="from_name" value="Wasme Tahir Website" />
                {/* Honeypot field to stop spam bots */}
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                {status === 'error' && (
                  <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                    Something went wrong. Please try again later.
                  </div>
                )}

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

                <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending...' : 'Send Message'} {!status && <ArrowRight size={16} />}
                </button>

              </form>
            )}
          </motion.div>

        </section>
      </div>
    </motion.div>
  );
};

export default Contact;
