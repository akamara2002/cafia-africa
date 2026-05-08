// "use client";

// import { motion, useInView } from "framer-motion";
// import { useRef, useState } from "react";
// import Image from "next/image";

// const partners = [
//   {
//     name: "Limkokwing University",
//     logo: "/images/limkokwing.jpeg",
//     description: "University of Creative Technology - Sierra Leone",
//   },
//   {
//     name: "Freetown Business Forum",
//     logo: "/images/whatsapp-20image-202025-11-24-20at-202.jpeg",
//     description: "A business hub driving growth - Sierra Leone",
//   },
//   {
//     name: "Be Noor Capital",
//     logo: "/images/be-noor-capital.png",
//     description: "Private equity and Capital Solutions - Malaysia",
//   },
// ];

// function PartnerCard({
//   partner,
//   index,
//   isInView,
// }: {
//   partner: (typeof partners)[0];
//   index: number;
//   isInView: boolean;
// }) {
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40, scale: 0.95 }}
//       animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
//       transition={{ duration: 0.6, delay: index * 0.2 }}
//       whileHover={{ scale: 1.05, y: -4 }}
//       className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300"
//     >
//       <motion.div
//         animate={{
//           y: [0, -10, 0],
//         }}
//         transition={{
//           duration: 3,
//           repeat: Number.POSITIVE_INFINITY,
//           ease: "easeInOut",
//           delay: index * 0.5,
//         }}
//         className="relative w-24 h-24 sm:w-32 sm:h-32 mb-3"
//       >
//         <Image
//           src={partner.logo || "/placeholder.svg"}
//           alt={partner.name}
//           fill
//           className="object-contain drop-shadow-lg"
//         />
//       </motion.div>
//       <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-1 line-clamp-2">
//         {partner.name}
//       </h3>
//       <p
//         className={`text-xs sm:text-sm text-gray-600 ${
//           isExpanded ? "" : "line-clamp-2"
//         }`}
//       >
//         {partner.description}
//       </p>
//       <button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium sm:hidden"
//       >
//         {isExpanded ? "Show less" : "Read more"}
//       </button>
//     </motion.div>
//   );
// }

// export default function PartnersSection() {
//   const sectionRef = useRef<HTMLElement>(null);
//   const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

//   return (
//     <section
//       ref={sectionRef}
//       id="partners"
//       className="relative py-16 md:py-20 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 overflow-hidden"
//     >
//       {/* Background decoration */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
//       </div>

//       <div className="container relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6">
//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={isInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-12 md:mb-16"
//         >
//           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//             Our Strategic Partners
//           </h2>
//           <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
//             Collaborating with leading institutions to drive financial inclusion
//             across Africa
//           </p>
//         </motion.div>

//         {/* Partners Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
//           {partners.map((partner, index) => (
//             <PartnerCard
//               key={index}
//               partner={partner}
//               index={index}
//               isInView={isInView}
//             />
//           ))}
//         </div>

//         {/* Animated Connection Lines */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={isInView ? { opacity: 1 } : {}}
//           transition={{ duration: 1, delay: 0.8 }}
//           className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl"
//         >
//           <svg className="w-full h-32" viewBox="0 0 800 120">
//             <motion.line
//               x1="200"
//               y1="60"
//               x2="600"
//               y2="60"
//               stroke="url(#partner-gradient)"
//               strokeWidth="2"
//               strokeDasharray="10 5"
//               initial={{ pathLength: 0 }}
//               animate={isInView ? { pathLength: 1 } : {}}
//               transition={{ duration: 2, delay: 1 }}
//             />
//             <defs>
//               <linearGradient
//                 id="partner-gradient"
//                 x1="0%"
//                 y1="0%"
//                 x2="100%"
//                 y2="0%"
//               >
//                 <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
//                 <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const partners = [
  {
    name: "Freetown Business Forum (Sierra Leone)",
    logo: "/images/whatsapp-20image-202025-11-24-20at-202.jpeg",
  },
  {
    name: "Be Noor Capital (Malaysia)",
    logo: "/images/be-noor-capital.png",
  },
  {
    name: "Sowa Health Team (United States Of America)",
    logo: "/images/sowa-health-team.jpeg",
  },
];

function PartnerCard({
  partner,
  index,
  isInView,
}: {
  partner: (typeof partners)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ scale: 1.05, y: -4 }}
      className="bg-white rounded-xl shadow-md p-3 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 h-auto"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: index * 0.5,
        }}
        className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2"
      >
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          className="object-contain drop-shadow-md"
        />
      </motion.div>

      {/* Partner Name Only */}
      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800">
        {partner.name}
      </h3>
    </motion.div>
  );
}

interface PartnersSectionProps {
  isCountryModalOpen?: boolean;
}

export default function PartnersSection({ isCountryModalOpen = false }: PartnersSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      id="partners"
      className={`relative py-16 md:py-20 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 overflow-hidden transition-all duration-300 ${isCountryModalOpen ? 'blur-md' : ''}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Our Strategic Partners
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Collaborating with leading institutions to drive financial inclusion
            across Africa
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {partners.map((partner, index) => (
            <PartnerCard
              key={index}
              partner={partner}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
