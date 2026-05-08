import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ResearchPublicationsContent from "@/components/research-publications-content";

export const metadata: Metadata = {
  title: "Research and Publications | CAFIA",
  description:
    "CAFIA policy reports and publications on financial inclusion, MSMEs, and digital finance in Africa.",
};

export default function ResearchPublicationsPage() {
  return (
    <>
      <Navbar />
      <ResearchPublicationsContent />
      <Footer />
    </>
  );
}
