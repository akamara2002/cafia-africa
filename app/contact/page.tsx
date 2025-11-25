// "use client"

// import type React from "react"

// import { motion } from "framer-motion"
// import { Mail, MapPin, Phone, Send } from "lucide-react"
// import { useState } from "react"
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"

// export default function ContactPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [successMessage, setSuccessMessage] = useState("")
//   const [errorMessage, setErrorMessage] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setSuccessMessage("")
//     setErrorMessage("")

//     try {
//       const response = await fetch("/api/contact", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       const data = await response.json()

//       if (response.ok) {
//         setSuccessMessage(data.message)
//         // Reset form
//         setFormData({ name: "", email: "", subject: "", message: "" })
//       } else {
//         setErrorMessage(data.error || "Failed to send message")
//       }
//     } catch (error) {
//       console.error("[v0] Form submission error:", error)
//       setErrorMessage("Network error. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen pt-24">
//         {/* Hero Section */}
//         <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
//           <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
//             <motion.div
//               initial={{ opacity: 0, y: 40 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="text-center"
//             >
//               <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Get In Touch</h1>
//               <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//                 Have questions or want to partner with us? We'd love to hear from you.
//               </p>
//             </motion.div>
//           </div>
//         </section>

//         {/* Contact Content */}
//         <section className="py-20 bg-gradient-to-b from-white to-blue-50">
//           <div className="container max-w-screen-xl mx-auto px-6">
//             <div className="grid lg:grid-cols-2 gap-12">
//               {/* Contact Form */}
//               <motion.div
//                 initial={{ opacity: 0, x: -40 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <div className="bg-white rounded-2xl shadow-xl p-8">
//                   <h2 className="text-3xl font-bold mb-6 text-gray-800">Send Us a Message</h2>
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                       <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                         Name
//                       </label>
//                       <input
//                         type="text"
//                         id="name"
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                         Email
//                       </label>
//                       <input
//                         type="email"
//                         id="email"
//                         value={formData.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
//                         Subject
//                       </label>
//                       <input
//                         type="text"
//                         id="subject"
//                         value={formData.subject}
//                         onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
//                         Message
//                       </label>
//                       <textarea
//                         id="message"
//                         value={formData.message}
//                         onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//                         rows={5}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
//                         required
//                       />
//                     </div>
//                     {successMessage && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
//                       >
//                         {successMessage}
//                       </motion.div>
//                     )}

//                     {errorMessage && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
//                       >
//                         {errorMessage}
//                       </motion.div>
//                     )}

//                     <motion.button
//                       type="submit"
//                       disabled={isLoading}
//                       whileHover={{ scale: isLoading ? 1 : 1.02 }}
//                       whileTap={{ scale: isLoading ? 1 : 0.98 }}
//                       className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <Send className="w-5 h-5" />
//                       {isLoading ? "Sending..." : "Send Message"}
//                     </motion.button>
//                   </form>
//                 </div>
//               </motion.div>

//               {/* Contact Info */}
//               <motion.div
//                 initial={{ opacity: 0, x: 40 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6 }}
//                 className="space-y-8"
//               >
//                 <div>
//                   <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Information</h2>
//                   <p className="text-gray-600 leading-relaxed mb-8">
//                     Reach out to us through any of the channels below. We're here to answer your questions and discuss
//                     partnership opportunities.
//                   </p>
//                 </div>

//                 <div className="space-y-6">
//                   {[
//                     {
//                       icon: Mail,
//                       title: "Email",
//                       content: "cafia.africa@gmail.com",
//                       color: "from-blue-500 to-cyan-400",
//                     },
//                     {
//                       icon: Phone,
//                       title: "Phone",
//                       content: "+60 18-393 7031",
//                       color: "from-green-500 to-emerald-400",
//                     },
//                     {
//                       icon: MapPin,
//                       title: "Location",
//                       content: "Freetown, Sierra Leone",
//                       color: "from-purple-500 to-pink-400",
//                     },
//                   ].map((item, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ delay: index * 0.1, duration: 0.6 }}
//                       whileHover={{ scale: 1.03 }}
//                       className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-4"
//                     >
//                       <div
//                         className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}
//                       >
//                         <item.icon className="w-6 h-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
//                         <p className="text-gray-600">{item.content}</p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </>
//   )
// }

"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
          <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Get In Touch
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Have questions or want to partner with us? We'd love to hear
                from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container max-w-screen-xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form (placeholder only) */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold mb-6 text-gray-800">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600">
                    The contact form is temporarily disabled. Please reach out
                    via email directly at{" "}
                    <a
                      href="mailto:cafia.africa@gmail.com"
                      className="text-blue-600 underline"
                    >
                      cafia.africa@gmail.com
                    </a>
                    .
                  </p>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-800">
                    Contact Information
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Reach out to us through any of the channels below. We're
                    here to answer your questions and discuss partnership
                    opportunities.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: Mail,
                      title: "Email",
                      content: "cafia.africa@gmail.com",
                      color: "from-blue-500 to-cyan-400",
                    },
                    {
                      icon: Phone,
                      title: "Phone",
                      content: "+60 18-393 7031",
                      color: "from-green-500 to-emerald-400",
                    },
                    {
                      icon: MapPin,
                      title: "Location",
                      content: "Freetown, Sierra Leone",
                      color: "from-purple-500 to-pink-400",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.03 }}
                      className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-4"
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
