"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import LeaderCard from "@/components/LeaderCard"

export default function AboutPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Smooth spring physics for premium feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Parallax transforms for different sections
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -50])

  const bgCircle1Y = useTransform(smoothProgress, [0, 1], [0, -300])
  const bgCircle2Y = useTransform(smoothProgress, [0, 1], [0, 200])

  return (
    <>
      <Navbar />
      <main ref={containerRef} className="min-h-screen pt-20 overflow-hidden">
        {/* Hero Section with Parallax */}
        <motion.section
          style={{ y: heroY }}
          className="py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden"
        >
          <motion.div style={{ y: bgCircle1Y }} className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute top-20 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
            />
          </motion.div>
          <motion.div style={{ y: bgCircle2Y }} className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"
            />
          </motion.div>

          <div className="container relative z-10 max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-20"
            >
              <motion.h1
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-6xl md:text-7xl font-bold mb-6 text-blue-700"
              >
                About CAFIA
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto font-medium"
              >
                Center for Africa Financial Inclusion and Advancement
              </motion.p>
            </motion.div>
            {/* Who We Are & Why CAFIA is Different - Scroll Storytelling */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl font-bold mb-8 text-blue-700"
                  >
                    Who We Are
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg text-gray-700 leading-relaxed mb-6"
                  >
                    CAFIA is an integrated solutions platform, building the systems that help MSMEs and informal workers
                    become visible, financially included, and economically resilient, including resilience to health
                    shocks. Based in Sierra Leone with a continental vision, we connect research intelligence,
                    technology innovation, enterprise development, and health inclusion to create pathways from survival
                    to sustainable growth.
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl font-bold mb-8 text-yellow-600"
                  >
                    Why CAFIA is Different
                  </motion.h2>
                  <ul className="space-y-5 text-gray-700">
                    {[
                      {
                        title: "Enterprise Pathway Focus",
                        text: "We support businesses at every stage, from informal vendors and survival enterprises to scaling MSMEs seeking growth.",
                        color: "blue-600",
                      },
                      {
                        title: "From Invisible to Investable",
                        text: "Turning hidden economies into measurable opportunities and impact.",
                        color: "yellow-600",
                      },
                      {
                        title: "Multi-Stakeholder Bridge",
                        text: "Connecting governments, banks, investors, and entrepreneurs into one ecosystem.",
                        color: "blue-600",
                      },
                      {
                        title: "Pan-African Vision",
                        text: "Starting in Sierra Leone, scaling across West Africa and beyond.",
                        color: "yellow-600",
                      },
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.6,
                          delay: 0.3 + index * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex items-start"
                      >
                        <span
                          className={`${item.color === "blue-600" ? "text-blue-600" : "text-yellow-600"} mr-3 mt-1 text-2xl`}
                        >
                          •
                        </span>
                        <span className="text-lg">
                          <strong>{item.title}</strong> – {item.text}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Mission & Vision - Enhanced with 3D transforms */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                <motion.div
                  initial={{ opacity: 0, rotateY: -15, scale: 0.9 }}
                  whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="glass-card-dark rounded-3xl p-10 text-white shadow-2xl hover:shadow-[0_25px_60px_rgba(2,6,23,0.7)] transition-all duration-500"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-lg font-semibold leading-relaxed opacity-95">
                    To advance inclusive economic growth across Africa by connecting data, innovation, and action. We
                    deliver research, technology solutions, advisory services, and capacity-building programs that
                    strengthen households, enterprises, and institutions.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, rotateY: 15, scale: 0.9 }}
                  whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.05, rotateY: -5 }}
                  className="relative rounded-3xl p-10 shadow-2xl hover:shadow-[0_25px_60px_rgba(245,158,11,0.5)] transition-all duration-500 overflow-hidden"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-600" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Our Vision</h2>
                    <p className="text-lg font-semibold leading-relaxed text-white drop-shadow-md">
                      An Africa where no enterprise remains invisible, where every household, entrepreneur, and business
                      has the data, tools, and opportunities to thrive in a digital, inclusive financial system.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Who We Serve - Staggered grid animation */}
              <div className="mb-20">
                <motion.h2
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl font-bold text-center mb-16 text-blue-700"
                >
                  Who We Serve
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Governments & Central Banks",
                      description: "Data and policy intelligence for effective inclusion strategies.",
                      color: "blue-600",
                    },
                    {
                      title: "Development Partners",
                      description: "Ground-truth insights to ensure measurable impact.",
                      color: "yellow-500",
                    },
                    {
                      title: "Private Sector",
                      description:
                        "Market intelligence and SME pipelines to de-risk expansion for banks, MFIs, and fintechs.",
                      color: "blue-600",
                    },
                    {
                      title: "SMEs & Survival Enterprises",
                      description: "Literacy, training, and pathways to finance.",
                      color: "yellow-500",
                    },
                    {
                      title: "Investors",
                      description: "High-potential deal flow and due diligence insights.",
                      color: "blue-600",
                    },
                    {
                      title: "Impact Funds",
                      description: "Curated SME pipelines and investment intelligence reports.",
                      color: "yellow-500",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      className={`glass-card-light rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 ${
                        item.color === "blue-600" ? "border-l-4 border-blue-600" : "border-l-4 border-yellow-500"
                      }`}
                    >
                      <h3
                        className={`text-2xl font-bold mb-4 ${item.color === "blue-600" ? "text-blue-600" : "text-yellow-500"}`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            {/* Leadership Team */}
            <div id="leadership" className="mt-20">
              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl font-bold text-center mb-12 text-blue-700"
              >
                Our Leadership Team
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {[
                  {
                    name: "Parvinjeet Kaur",
                    role: "Chief Executive Officer",
                    credentials: "MBA (ASB–MIT Sloan) | ACCA | Inclusive Finance Architect | Ecosystem Builder",
                    imageSrc: "/images/parvinjeet-kaur.png",
                    borderColor: "blue-100",
                    buttonColor: "blue",
                    delay: 0,
                    shortBio:
                      "Parvinjeet Kaur is Chief Executive Officer of CAFIA. With an MBA from MIT Sloan School of Management and ACCA qualification, she is a leading architect of inclusive finance ecosystems in Africa.",
                    fullBio: (
                      <>
                        <p>
                          Parvinjeet Kaur is Chief Executive Officer of CAFIA, where she leads strategy,
                          partnerships, and ecosystem development. With an MBA from MIT Sloan School of Management and
                          ACCA qualification, she brings over a decade of experience in financial inclusion, enterprise
                          development, and data-driven policy design.
                        </p>
                        <p>
                          Her work focuses on bridging the gap between informal economies and formal finance, leveraging
                          technology and research to unlock opportunities for underserved enterprises across Africa.
                          Parvinjeet has advised governments, development partners, and private sector institutions on
                          inclusive growth strategies, SME financing, and digital financial services.
                        </p>
                        <p>
                          She is passionate about transforming Africa's economic landscape through innovation,
                          collaboration, and evidence-based solutions.
                        </p>
                      </>
                    ),
                  },
                  {
                    name: "Assoc. Professor Dr.Muhammad-Abbas Conteh",
                    role: "Assoc. Professor",
                    credentials: "MD | ABIM | Physician | Health Systems Specialist",
                    imageSrc: "/images/muhammad-abbas-conteh.png",
                    borderColor: "green-100",
                    buttonColor: "green",
                    delay: 0.15,
                    shortBio:
                      "Dr. Muhammad-Abbas Conteh is a physician, academic, and health systems specialist who brings deep expertise in public health policy, and community resilience to CAFIA's work. He contributes to CAFIA's research and advisory engagements at the intersection of health, and its social impact, on businesses across Africa.",
                    fullBio: (
                      <>
                        <p>
                          Dr. Muhammad-Abbas Conteh is a physician, academic, and health systems specialist who brings deep expertise in public health policy, and community resilience to CAFIA's work.
                        </p>
                        <p>
                          He contributes to CAFIA's research and advisory engagements at the intersection of health, and its social impact, on businesses across Africa.
                        </p>
                      </>
                    ),
                  },
                  {
                    name: "Alim Ismael Kamara",
                    role: "Director of Technology",
                    credentials: "Computer Engineer | Full-Stack Developer | AI Innovation Specialist",
                    imageSrc: "/images/alim-ismael-kamara.jpg",
                    borderColor: "purple-100",
                    buttonColor: "purple",
                    delay: 0.3,
                    shortBio:
                      "Alim Ismael Kamara is a computer engineer and full-stack developer who leads CAFIA's technology innovation, building digital platforms that connect data, enterprises, and financial services.",
                    fullBio: (
                      <>
                        <p>
                          Alim Ismael Kamara is the Director of Technology at CAFIA, responsible for designing and
                          building the digital infrastructure that powers CAFIA's data platform, enterprise tools, and
                          stakeholder interfaces. As a computer engineer and full-stack developer, he specializes in
                          AI-driven solutions, web and mobile application development, and systems integration.
                        </p>
                        <p>
                          At CAFIA, Alim leads the development of the SME DataHub, digital literacy tools, and
                          technology partnerships that enhance financial access and transparency across Africa. His
                          expertise in artificial intelligence and machine learning enables CAFIA to deliver predictive
                          insights and automated solutions for complex economic challenges.
                        </p>
                        <p>
                          He is passionate about leveraging technology to democratize access to finance and unlock
                          Africa's digital economy potential.
                        </p>
                      </>
                    ),
                  },
                ].map((leader, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 60, rotateX: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.8,
                      delay: leader.delay,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <LeaderCard
                      name={leader.name}
                      role={leader.role}
                      credentials={leader.credentials}
                      imageSrc={leader.imageSrc}
                      shortBio={leader.shortBio}
                      fullBio={leader.fullBio}
                      borderColor={leader.borderColor}
                      buttonColor={leader.buttonColor}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  )
}
