import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BlurRevealHeading from '../components/BlurRevealHeading';
import { siteData } from '../data/siteData';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="w-full bg-[#000000] text-white pt-28 sm:pt-36">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Main Heading */}
        <div className="pb-16 sm:pb-24 border-b border-white/20">
          <BlurRevealHeading
            text="Let’s create something extraordinary together"
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[1.1] max-w-5xl"
          />
        </div>

        {/* Form and Address Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 py-16 sm:py-24 border-b border-white/20">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
              GET IN TOUCH
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 sm:p-12 rounded-[24px] bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center space-y-4"
              >
                <span className="text-4xl">✓</span>
                <h3 className="text-2xl sm:text-3xl font-bold">Message Sent</h3>
                <p className="text-white/70 max-w-md">
                  Thank you for reaching out. We will review your inquiry and get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ firstName: '', lastName: '', email: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 bg-white text-black font-bold rounded-full text-sm hover:bg-white/80 transition-colors"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/70">
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="podolski"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors text-base"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/70">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="makanaki"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors text-base"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/70">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="podolski@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors text-base"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/70">
                    MESSAGE
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Enter your message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors text-base resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-[4px] bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-white/90 active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'SUBMIT'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Address & Inquiries */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-12 lg:pl-10">
            {/* Address */}
            <div className="flex flex-col space-y-3">
              <span className="text-sm font-bold uppercase tracking-widest text-white/50">
                Address
              </span>
              <p className="text-xl sm:text-2xl font-bold text-white">
                Maple Avenue
              </p>
              <p className="text-lg sm:text-xl font-semibold text-white/70">
                Manchester M1 4BT, United Kingdom
              </p>
            </div>

            {/* Inquiries */}
            <div className="flex flex-col space-y-3">
              <span className="text-sm font-bold uppercase tracking-widest text-white/50">
                Inquiries
              </span>
              <a
                href={`mailto:${siteData.meta.email}`}
                className="text-xl sm:text-2xl font-bold text-white hover:text-white/70 transition-colors"
              >
                {siteData.meta.email}
              </a>
            </div>
          </div>
        </div>

        {/* Offices Section */}
        <div className="py-20 sm:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
            {siteData.offices.map((office) => (
              <motion.div
                key={office.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex flex-col space-y-6"
              >
                <div className="w-full aspect-[4/3] rounded-[24px] overflow-hidden bg-[#111111]">
                  <img
                    src={office.image}
                    alt={office.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                    {office.title}
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-white/60">
                    {office.address}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

