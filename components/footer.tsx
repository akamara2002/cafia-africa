"use client";

import type React from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Linkedin } from "lucide-react";

const footerLinks = {
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Strategic Pillars", href: "/strategic-pillars" },
    { name: "Team", href: "/about#leadership" },
  ],
  Resources: [
    { name: "Research", href: "/research" },
    { name: "DataHub", href: "/datahub" },
    { name: "Blog", href: "/blog" },
  ],
  Programs: [
    { name: "Research", href: "/strategic-pillars#research" },
    { name: "Data", href: "/strategic-pillars#data" },
    { name: "Academy", href: "/strategic-pillars#academy" },
    { name: "Advisory", href: "/strategic-pillars#advisory" },
    { name: "Tech Lab", href: "/strategic-pillars#techlab" },
    { name: "Islamic Finance", href: "/strategic-pillars#islamicfinance" },
    { name: "Health Inclusion", href: "/strategic-pillars#healthinclusion" },
  ],
  Connect: [
    { name: "Contact", href: "/contact" },
    { name: "Partners", href: "#partners" },
  ],
};

export default function Footer() {
  const handlePartnersClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const partnersSection = document.getElementById("partners");
    if (partnersSection) {
      partnersSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 pt-16 pb-8 overflow-hidden">
      {/* Decorative Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative w-12 h-12"
              >
                <Image
                  src="/images/2cafia-20logo.jpg"
                  alt="CAFIA Logo"
                  fill
                  className="object-contain"
                />
              </motion.div>
              <span className="text-2xl font-bold text-white">CAFIA</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4 text-gray-400">
              Center for Africa Financial Inclusion and Advancement.
              Transforming Africa's informal sector into a catalyst for
              inclusive economic growth.
            </p>

            {/* LinkedIn Section */}
            {/* <div className="mt-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-blue-400" />
                Follow Us on LinkedIn
              </h3>
              <Link
                href="https://www.linkedin.com/company/cafia-africa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
              >
                <span>Latest updates and insights</span>
                <motion.span whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  →
                </motion.span>
              </Link>
            </div> */}
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.name === "Partners" ? (
                      <a
                        href={link.href}
                        onClick={handlePartnersClick}
                        className="text-sm text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 cursor-pointer"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 CAFIA. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
