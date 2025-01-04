import React, { useState } from 'react';
import { sendContactForm } from '../utils/api';

const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { email, issueType, description };

    try {
      const response = await sendContactForm(formData);
      setStatusMessage(response.message || 'Message sent successfully!');
    } catch (error) {
      setStatusMessage('Failed to send message.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Issue Type"
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Send Message
        </button>
      </form>
      {statusMessage && <p className="mt-4 text-center">{statusMessage}</p>}
    </div>
  );
};

export default ContactForm;
