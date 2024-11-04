"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronDown,
  Linkedin,
  Plus,
  Minus,
  Menu,
  CalendarDays,
  ArrowRight,
  PlayCircle,
  Mail,
  Mic,
  Edit,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useSession, signOut } from "next-auth/react"; // Import useSession and signOut

export default function HomePage() {
  // Access session data and authentication status
  const { data: session, status } = useSession();

  const [navbarSolid, setNavbarSolid] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    "entry.2127377522": "",
    "entry.1702212493": "",
    "entry.760562371": "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavbarSolid(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    handleCloseModal();
    setShowAlert(true);

    const form = e.target as HTMLFormElement;
    const formDataToSubmit = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formDataToSubmit,
      mode: "no-cors",
    })
      .then(() => {
        console.log("Form submitted successfully");
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });

    setFormData({
      "entry.2127377522": "",
      "entry.1702212493": "",
      "entry.760562371": "",
    });

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const faqs = [
    {
      question: "How does Zyke capture my brand's unique voice?",
      answer:
        "Zyke uses advanced AI algorithms to analyze your brand's tone, style, and messaging. You can provide specific inputs like product details, audience preferences, and emotional tone to ensure the generated content aligns perfectly with your brand's identity.",
    },
    {
      question: "Can I edit AI-generated content easily?",
      answer:
        "With Zyke's intuitive editing tool, you can fine-tune specific sections of your AI-generated content or remove elements using simple text-based prompts. This allows you to customize every aspect of the content with precision.",
    },
    {
      question: "What kind of content can Zyke help me create?",
      answer:
        "Zyke helps you craft a wide range of content, from social media posts inspired by trending topics to in-depth articles, viral ideas, and visual designs. It's designed to keep your brand relevant across platforms like Instagram, LinkedIn, and more.",
    },
    {
      question: "Is Zyke safe to use for handling my data?",
      answer:
        "Yes, Zyke takes your data security seriously. We implement industry-leading encryption standards and privacy practices to ensure that your data remains secure and confidential.",
    },
    {
      question: "How fast can I expect results with Zyke?",
      answer:
        "With Zyke's AI-powered tools, you can generate high-quality content in seconds, allowing you to start engaging your audience almost instantly.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans">
      {/* Navigation Bar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          navbarSolid ? "bg-gray-900 shadow-md" : "bg-white backdrop-blur-lg"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            href="/"
            className={`text-4xl sm:text-3xl font-bold ${
              navbarSolid ? " text-white" : " backdrop-blur-lg"
            }`}
          >
            Zyke
          </Link>

          <div className="hidden md:flex space-x-8 text-gray-900">
            <Link
              href="#product"
              className={`hover:text-gray-400 transition-colors duration-300 ${
                navbarSolid ? " text-white" : " backdrop-blur-lg"
              }`}
            >
              Product
            </Link>
            <Link
              href="#book-session"
              className={`hover:text-gray-400 transition-colors duration-300 ${
                navbarSolid ? " text-white" : " backdrop-blur-lg"
              }`}
            >
              Book a Session
            </Link>
            <Link
              href="#faqs"
              className={`hover:text-gray-400 transition-colors duration-300 ${
                navbarSolid ? " text-white" : " backdrop-blur-lg"
              }`}
            >
              FAQs
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Conditionally render buttons based on authentication status */}
            {status === "loading" ? (
              // Optionally, show a loading state
              <Button size="lg" variant="ghost" disabled>
                Loading...
              </Button>
            ) : session ? (
              <>
                {/* "Generate Ideas" Button for Authenticated Users */}
                <Link href="/idea-generator">
                  <Button
                    size="lg"
                    variant="primary"
                    className="bg-black hover:bg-gray-900 text-white px-8"
                  >
                    Generate Ideas
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* "Sign In" Button for Unauthenticated Users */}
                <Link href="/signin">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-black text-black hover:bg-gray-100 px-8"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Toggle Mobile Menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900"
            >
              <div className="px-4 pt-2 pb-4 space-y-2">
                <Link
                  href="#product"
                  className="block py-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Product
                </Link>
                <Link
                  href="#book-session"
                  className="block py-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Book a Session
                </Link>
                <Link
                  href="#faqs"
                  className="block py-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  FAQs
                </Link>
                {/* Conditionally render mobile buttons based on authentication */}
                {status === "loading" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled
                    className="w-full bg-white text-black hover:bg-gray-100 px-8"
                  >
                    Loading...
                  </Button>
                ) : session ? (
                  <>
                    <Link href="/idea-generator">
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full bg-white text-black hover:bg-gray-100 px-8"
                      >
                        Generate Ideas
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    size="sm"
                    className="w-full bg-white text-black hover:bg-gray-200 mt-2 transition-colors duration-300"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Header Section */}
      <header className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-70 via-blue-100 to-white">
        <motion.div className="z-10 space-y-6 max-w-4xl" {...fadeInUp}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-black">
            Automate social media content creation process using Gen AI
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-800">
            Help businesses ideate and design personalized marketing content
            cheaper and faster
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {status === "loading" ? (
              <Button size="lg" variant="ghost" disabled>
                Loading...
              </Button>
            ) : session ? (
              <Link href="/idea-generator">
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-900 text-white px-8"
                >
                  Generate Ideas
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                size="lg"
                className="bg-black hover:bg-gray-900 text-white px-8"
              >
                Get Started
              </Button>
            )}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-black text-black hover:bg-gray-100 px-8"
            >
              <Link href="#book-session">Book a Demo</Link>
            </Button>
          </div>
        </motion.div>
        <div className="absolute bottom-8 animate-bounce">
          <Link
            href="#product"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronDown size={32} />
          </Link>
        </div>
      </header>

      {/* Product Section */}
      <section id="product" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              Our Product
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-12 text-center">
              Zyke automates your social media pipeline in seconds!
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Align AI with your Brand Tone",
                description:
                  "Ensure your AI-generated content perfectly reflects your brand's unique tone and personality, customized for your specific audience and style.",
                icon: <Mic className="w-12 h-12 mb-4 text-gray-900" />,
              },
              {
                title: "Edit with Precision Prompts",
                description:
                  "Effortlessly edit AI-generated content by isolating and modifying specific sections, or removing elements entirely, all with simple text prompts.",
                icon: <Edit className="w-12 h-12 mb-4 text-gray-900" />,
              },
              {
                title: "Craft Content from Trends and Viral Ideas",
                description:
                  "Create compelling content fueled by the latest trends, viral topics, and creative concepts to ensure your brand captures attention and stays ahead of the curve.",
                icon: <TrendingUp className="w-12 h-12 mb-4 text-gray-900" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-50 hover:bg-white transition-all duration-300 transform hover:-translate-y-2 border-gray-200">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    {feature.icon}
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 sm:py-6 text-lg rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Book Session Section */}
      <section id="book-session" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Book a Demo Session
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
              Experience the power of Zyke firsthand. Schedule a personalized
              demo with our experts and discover how we can transform your
              social media strategy.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Choose Your Session Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  className="w-full justify-between hover:cursor-pointer"
                  size="lg"
                  onClick={handleOpenModal}
                >
                  <span className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-5 w-5" />
                      Schedule a One-on-One Demo
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between"
                  size="lg"
                >
                  <Link
                    href="https://drive.google.com/file/d/1UbSBUBYX8Au5hNaMsXjqkcSVNp9plK4u/view?usp=sharing"
                    target="_blank"
                  >
                    <span className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Watch Product Video
                      </div>
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Have questions? We&apos;re here to help!
            </p>
            <Button asChild variant="outline">
              <Link href="mailto:founders@zyke.in">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              FAQs
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-12 text-center">
              Frequently Asked Questions
            </p>
          </motion.div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="border border-gray-200 rounded-lg overflow-hidden"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    {openFaq === index ? (
                      <Minus size={20} />
                    ) : (
                      <Plus size={20} />
                    )}
                  </div>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-white"
                      >
                        <p className="text-gray-700">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black text-gray-900 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Zyke</h3>
            <p className="text-gray-400 mb-4">
              Accelerate your social media presence with intelligent automation.
              Sign up today to transform how you engage with your audience.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#product"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Product
                </Link>
              </li>
              <li>
                <Link
                  href="#book-session"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Book a Demo
                </Link>
              </li>
              <li>
                <Link
                  href="#faqs"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Terms and Conditions
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Terms and Conditions</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[60vh] pr-4">
                      <div className="p-6 text-sm">
                        <p className="mb-4">Last updated on Oct 25 2024</p>
                        <p className="mb-4">
                          For the purpose of these Terms and Conditions, The
                          term "we", "us", "our" used anywhere on this page
                          shall mean TASMAY PANKAJ TIBREWAL, whose
                          registered/operational office is Meghnad Saha Hall,
                          IIT Kharagpur West Midnapore WEST BENGAL 721302.
                          "you", "your", "user", "visitor" shall mean any
                          natural or legal person who is visiting our website
                          and/or agreed to purchase from us.
                        </p>
                        <h2 className="text-lg font-semibold mb-2">
                          Your use of the website and/or purchase from us are
                          governed by following Terms and Conditions:
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            The content of the pages of this website is subject
                            to change without notice.
                          </li>
                          <li>
                            Neither we nor any third parties provide any
                            warranty or guarantee as to the accuracy,
                            timeliness, performance, completeness or suitability
                            of the information and materials found or offered on
                            this website for any particular purpose. You
                            acknowledge that such information and materials may
                            contain inaccuracies or errors and we expressly
                            exclude liability for any such inaccuracies or
                            errors to the fullest extent permitted by law.
                          </li>
                          <li>
                            Your use of any information or materials on our
                            website and/or product pages is entirely at your own
                            risk, for which we shall not be liable. It shall be
                            your own responsibility to ensure that any products,
                            services or information available through our
                            website and/or product pages meet your specific
                            requirements.
                          </li>
                          <li>
                            Our website contains material which is owned by or
                            licensed to us. This material includes, but is not
                            limited to, the design, layout, look, appearance and
                            graphics. Reproduction is prohibited other than in
                            accordance with the copyright notice, which forms
                            part of these terms and conditions.
                          </li>
                          <li>
                            All trademarks reproduced in our website which are
                            not the property of, or licensed to, the operator
                            are acknowledged on the website.
                          </li>
                          <li>
                            Unauthorized use of information provided by us shall
                            give rise to a claim for damages and/or be a
                            criminal offense.
                          </li>
                          <li>
                            From time to time our website may also include links
                            to other websites. These links are provided for your
                            convenience to provide further information.
                          </li>
                          <li>
                            You may not create a link to our website from
                            another website or document without TASMAY PANKAJ
                            TIBREWAL's prior written consent.
                          </li>
                          <li>
                            Any dispute arising out of use of our website and/or
                            purchase with us and/or any engagement with us is
                            subject to the laws of India.
                          </li>
                          <li>
                            We, shall be under no liability whatsoever in
                            respect of any loss or damage arising directly or
                            indirectly out of the decline of authorization for
                            any Transaction, on Account of the Cardholder having
                            exceeded the preset limit mutually agreed by us with
                            our acquiring bank from time to time.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Cancellation & Refund
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancellation & Refund Policy</DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                      <p className="mb-4">Last updated on Oct 25 2024</p>
                      <p>No cancellations & Refunds are entertained</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Shipping Policy
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Shipping and Delivery</DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                      <p className="mb-4">Last updated on Oct 25 2024</p>
                      <p>Shipping is not applicable for business.</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      Privacy Policy
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Privacy Policy</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[60vh] pr-4">
                      <div className="p-6 text-sm">
                        <p className="mb-4">Last updated on Oct 25 2024</p>
                        <p>
                          <strong>
                            Section 1 - What do we do with your information?
                          </strong>
                        </p>
                        <br></br>
                        <p>
                          When you purchase something from our store, as part of
                          the buying and selling process, we collect the
                          personal information you give us such as your name,
                          address and email address. When you browse our store,
                          we also automatically receive your computer's internet
                          protocol (IP) address in order to provide us with
                          information that helps us learn about your browser and
                          operating system. Email marketing (if applicable):
                          With your permission, we may send you emails about our
                          store, new products and other updates.
                        </p>
                        <br></br>
                        <p>
                          <strong>Section 2 - Consent</strong>
                        </p>
                        <br></br>
                        <p>How do you get my consent?</p>
                        <br></br>
                        <p>
                          When you provide us with personal information to
                          complete a transaction, verify your credit card, place
                          an order, arrange for a delivery or return a purchase,
                          we imply that you consent to our collecting it and
                          using it for that specific reason only.
                        </p>
                        <p>
                          If we ask for your personal information for a
                          secondary reason, like marketing, we will either ask
                          you directly for your expressed consent, or provide
                          you with an opportunity to say no.{" "}
                        </p>
                        <br></br>
                        <p>How do I withdraw my consent? </p>
                        <br></br>
                        <p>
                          If after you opt-in, you change your mind, you may
                          withdraw your consent for us to contact you, for the
                          continued collection, use or disclosure of your
                          information, at anytime, by contacting us by mailing
                          us at: founders@zyke.in
                        </p>
                        <br></br>
                        <p>
                          <strong>Section 3 - Disclosure</strong>
                        </p>
                        <br></br>
                        <p>
                          We may disclose your information if required by law or
                          if you violate our Terms of Service.
                        </p>
                        <p>
                          <br></br>
                          <strong>Section 4 - Payment</strong>
                        </p>
                        <br></br>
                        <p>
                          We use Razorpay for processing payments. We/Razorpay
                          do not store your card data on their servers. The data
                          is encrypted through the Payment Card Industry Data
                          Security Standard (PCI-DSS) when processing payment.
                          Your purchase transaction data is only used as long as
                          is necessary to complete your purchase transaction.
                          After that is complete, your purchase transaction
                          information is not saved.
                        </p>
                        <br></br>
                        <p>
                          {" "}
                          Our payment gateway adheres to the standards set by
                          PCI-DSS as managed by the PCI Security Standards
                          Council, which is a joint effort of brands like Visa,
                          MasterCard, American Express and Discover.{" "}
                        </p>
                        <br></br>
                        <p>
                          PCI-DSS requirements help ensure the secure handling
                          of credit card information by our store and its
                          service providers. For more insight, you may also want
                          to read terms and conditions of razorpay on
                          https://razorpay.com
                        </p>
                        <br></br>
                        <p>
                          <strong>Section 5 - Third-Party Services</strong>
                        </p>
                        <br></br>
                        <p>
                          In general, the third-party providers used by us will
                          only collect, use and disclose your information to the
                          extent necessary to allow them to perform the services
                          they provide to us.
                        </p>
                        <br></br>
                        <p>
                          {" "}
                          However, certain third-party service providers, such
                          as payment gateways and other payment transaction
                          processors, have their own privacy policies in respect
                          to the information we are required to provide to them
                          for your purchase-related transactions.{" "}
                        </p>
                        <br></br>
                        <p>
                          For these providers, we recommend that you read their
                          privacy policies so you can understand the manner in
                          which your personal information will be handled by
                          these providers.
                        </p>
                        <br></br>
                        <p>
                          {" "}
                          In particular, remember that certain providers may be
                          located in or have facilities that are located a
                          different jurisdiction than either you or us. So if
                          you elect to proceed with a transaction that involves
                          the services of a third-party service provider, then
                          your information may become subject to the laws of the
                          jurisdiction(s) in which that service provider or its
                          facilities are located.{" "}
                        </p>
                        <br></br>
                        <p>
                          Once you leave our store's website or are redirected
                          to a third-party website or application, you are no
                          longer governed by this Privacy Policy or our
                          website's Terms of Service. Links When you click on
                          links on our store, they may direct you away from our
                          site. We are not responsible for the privacy practices
                          of other sites and encourage you to read their privacy
                          statements.
                        </p>
                        <br></br>
                        <p>
                          <strong>Section 6 - Security</strong>
                        </p>
                        <br></br>
                        <p>
                          To protect your personal information, we take
                          reasonable precautions and follow industry best
                          practices to make sure it is not inappropriately lost,
                          misused, accessed, disclosed, altered or destroyed.
                        </p>
                        <br></br>
                        <p>
                          <strong>Section 7 - Cookies</strong>
                        </p>
                        <br></br>
                        <p>
                          We use cookies to maintain session of your user. It is
                          not used to personally identify you on other websites.
                        </p>
                        <br></br>
                        <p>
                          <strong>Section 8 - Age of Consent</strong>
                        </p>
                        <br></br>
                        <p>
                          By using this site, you represent that you are at
                          least the age of majority in your state or province of
                          residence, or that you are the age of majority in your
                          state or province of residence and you have given us
                          your consent to allow any of your minor dependents to
                          use this site.
                        </p>
                        <br></br>
                        <p>
                          <strong>
                            Section 9 - Changes to this Privacy Policy
                          </strong>
                        </p>
                        <br></br>
                        <p>
                          We reserve the right to modify this privacy policy at
                          any time, so please review it frequently. Changes and
                          clarifications will take effect immediately upon their
                          posting on the website. If we make material changes to
                          this policy, we will notify you here that it has been
                          updated, so that you are aware of what information we
                          collect, how we use it, and under what circumstances,
                          if any, we use and/or disclose it.
                        </p>
                        <br></br>
                        <p>
                          {" "}
                          If our store is acquired or merged with another
                          company, your information may be transferred to the
                          new owners so that we may continue to sell products to
                          you.
                        </p>
                        <br></br>
                        <p>
                          <strong>Questions and Contact Information</strong>
                        </p>
                        <br></br>
                        <p>
                          If you would like to: access, correct, amend or delete
                          any personal information we have about you, register a
                          complaint, or simply want more information contact our
                          Privacy Compliance Officer at{" "}
                          <strong>IIT Kharagpur</strong> or by mail at{" "}
                          <strong>founders@zyke.in</strong>
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Connect</h4>
            <div className="flex space-x-4">
              <Link
                href="https://www.linkedin.com/company/zykelabs/"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
              >
                <Linkedin size={24} />
              </Link>
              <Link
                href="mailto:founders@zyke.in"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={24} />
              </Link>
            </div>
            <h4 className="text-lg font-bold text-white mt-6">Contact Us</h4>
            <div className="flex flex-col space-x-4">
              <ul>
                <li>
                  <h5 className="text-md text-white">founders@zyke.in</h5>
                </li>
                <li>
                  <h5 className="text-md text-white">+91 9452912935</h5>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-600 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Zyke. All rights reserved.</p>
          <p className="mt-2">Last updated on Oct 25 2024. IIT Kharagpur</p>
        </div>
      </footer>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle>Schedule One-on-One Demo</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            action="https://docs.google.com/forms/d/e/1FAIpQLScnyXPJnG1fhlmjcFxy86nFR5eVTmbWVxfD1ixPBo127hC1zA/formResponse"
          >
            <div className="space-y-4">
              <Input
                name="entry.2127377522"
                placeholder="Your Name"
                value={formData["entry.2127377522"]}
                onChange={handleInputChange}
                required
              />
              <Input
                name="entry.1702212493"
                type="email"
                placeholder="Your Email"
                value={formData["entry.1702212493"]}
                onChange={handleInputChange}
                required
              />
              <Input
                name="entry.760562371"
                type="date"
                placeholder="Preferred Date"
                value={formData["entry.760562371"]}
                onChange={handleInputChange}
                required
              />
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" className="bg-blue-500 text-white">
                Schedule Now
              </Button>
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="ml-2"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {showAlert && (
        <Alert className="fixed bottom-4 right-4 w-96 bg-green-100 border-green-400">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            Your demo session has been scheduled.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
