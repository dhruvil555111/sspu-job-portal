import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success('Thank you! Your query has been submitted.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1200);
  };

  const contactInfo = [
    { title: 'Email Queries', detail: 'placements@ljku.edu.in', sub: 'For company registration & drives', icon: <HiOutlineMail className="w-6 h-6 text-primary-500" /> },
    { title: 'Helpline Number', detail: '+91 79 26750411', sub: 'Mon to Sat: 9:00 AM to 5:00 PM', icon: <HiOutlinePhone className="w-6 h-6 text-pink-500" /> },
    { title: 'Placement Address', detail: 'Central Placement Office, LJ Campus', sub: 'S.G. Highway, Ahmedabad, Gujarat 382210', icon: <HiOutlineLocationMarker className="w-6 h-6 text-purple-500" /> },
    { title: 'Office Hours', detail: '09:00 AM - 05:00 PM', sub: 'Except Sundays & Public Holidays', icon: <HiOutlineClock className="w-6 h-6 text-green-500" /> },
  ];

  return (
    <div className="min-h-screen pt-24 bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 dark:text-white">
            Contact Placement Cell
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-2 max-w-xl">
            Have questions regarding recruiters, drive registrations, or student profiles? Reach out to our support team.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Grid Contact Cards */}
          <div className="lg:col-span-1 grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-6 shadow-md"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-dark-50 dark:bg-dark-800 rounded-xl flex items-center justify-center">
                    {info.icon}
                  </div>
                  <h3 className="font-display font-bold text-dark-900 dark:text-white text-sm">{info.title}</h3>
                </div>
                <p className="text-sm font-bold text-primary-600 dark:text-primary-400 leading-snug">{info.detail}</p>
                <p className="text-[10px] text-dark-400 mt-0.5">{info.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact form & map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form */}
            <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-3xl p-8 shadow-md">
              <h3 className="text-base font-display font-bold text-dark-900 dark:text-white mb-6">Send an Inquiry</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-dark-500 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field py-2 text-xs"
                      placeholder="e.g. Rahul Patel"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-dark-500 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field py-2 text-xs"
                      placeholder="e.g. rahul@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-dark-500 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field py-2 text-xs"
                    placeholder="e.g. Drive registration issue"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-dark-500 block mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field py-2 text-xs"
                    placeholder="Describe your issue or inquiry details..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
                >
                  {sending ? 'Sending Query...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>

            {/* Map Frame */}
            <div className="rounded-3xl overflow-hidden border border-dark-100 dark:border-dark-800 shadow-md h-56 bg-white dark:bg-dark-900">
              <iframe
                title="LJ Campus Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m14!1m8!1m3!1d14686.079237699317!2d72.4880521!3d22.955519!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9bca9a555555%3A0xd14df834460f1b2b!2sL.J.%20University!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
