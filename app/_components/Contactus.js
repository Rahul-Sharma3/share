"use client"
import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Send, User, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactUs = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    user_name: false,
    user_email: false,
    message: false
  });

  const validateForm = (e) => {
    e.preventDefault();
    const newErrors = {
      user_name: !form.current.user_name.value,
      user_email: !form.current.user_email.value,
      message: !form.current.message.value
    };
    
    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return false;
    }

    sendEmail(e);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm(
        'service_00g9pb6',
        'template_7or0u9e',
        form.current,
        'HJdrjSfn159Ia4RbK'
      )
      .then(
        (result) => {
          toast.success('Message sent successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              fontSize: '14px',
              padding: '10px',
              maxWidth: '300px'
            },
          });
          form.current.reset();
        },
        (error) => {
          toast.error('Failed to send message.', {
            position: "top-right",
            autoClose: 3000,
            style: {
              fontSize: '14px',
              padding: '10px',
              maxWidth: '300px'
            },
          });
          console.log(error.text);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <section className="h-screen overflow-hidden bg-gray-900 relative flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-800 animate-gradient bg-[length:200%_200%] opacity-50" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Floating shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          fontSize: '14px',
          top: '4.5em',
          right: '1em'
        }}
      />

      <div className="relative w-full max-w-screen-xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-4xl sm:text-5xl font-extrabold text-transparent mb-4">
            Contact Us
          </h1>

          <p className="mx-auto max-w-xl text-base sm:text-lg text-gray-300 mb-6">
            We'd love to hear from you! Fill out the form below and our team will get back to you shortly.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20"
          >
            <form ref={form} onSubmit={validateForm} className="space-y-4 sm:space-y-6" noValidate>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Your Name"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border 
                    ${errors.user_name ? 'border-red-500' : 'border-white/10'}
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white 
                    placeholder-gray-400 transition-all outline-none`}
                  onFocus={() => setErrors({...errors, user_name: false})}
                />
                <AnimatePresence>
                  {errors.user_name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-10 left-0 bg-red-500 text-white px-3 py-1 rounded-md 
                        text-sm flex items-center gap-1 shadow-lg"
                    >
                      <AlertCircle size={14} />
                      Please enter your name
                      <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="user_email"
                  placeholder="Your Email"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border 
                    ${errors.user_email ? 'border-red-500' : 'border-white/10'}
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white 
                    placeholder-gray-400 transition-all outline-none`}
                  onFocus={() => setErrors({...errors, user_email: false})}
                />
                <AnimatePresence>
                  {errors.user_email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-10 left-0 bg-red-500 text-white px-3 py-1 rounded-md 
                        text-sm flex items-center gap-1 shadow-lg"
                    >
                      <AlertCircle size={14} />
                      Please enter your email
                      <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <div className="absolute top-3 left-0 flex items-start pl-4 pointer-events-none text-gray-400">
                  <MessageSquare size={20} />
                </div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  rows="3"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 
                    transition-all outline-none resize-none"
                  onFocus={() => setErrors({...errors, message: false})}
                />
                <AnimatePresence>
                  {errors.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-10 left-0 bg-red-500 text-white px-3 py-1 rounded-md 
                        text-sm flex items-center gap-1 shadow-lg"
                    >
                      <AlertCircle size={14} />
                      Please enter your message
                      <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative inline-flex items-center justify-center overflow-hidden 
                  rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-medium 
                  text-white transition-all duration-300 ease-out hover:from-blue-700 hover:to-indigo-700 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  // Loading state
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  // Default state with hover animation
                  <>
                    <span className="absolute right-0 translate-x-full group-hover:-translate-x-4 opacity-0 
                      group-hover:opacity-100 transition-all duration-300">
                      <Send className="w-5 h-5" />
                    </span>
                    <span className="group-hover:-translate-x-4 transition-all duration-300">
                      Send Message
                    </span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;