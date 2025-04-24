"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Video, Menu, X } from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import {Icons} from "@/components/icons";
import {useAuth} from "@/context/auth-context";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = ["home", "features", "pricing", "about", "contact"]; // Updated sections array
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
    const {handleAccessAppButtonClick} = useAuth();

  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "Features", href: "/#features" },
    { name: "Demo", href: "/#demo" },
    // { name: "Plus", href: "/#pricing" },
    // { name: "About", href: "/about" },
    // { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.nav
      className={cn(
        "fixed top-4 left-0 right-0 z-50 transition-all duration-300",
        "rounded-full backdrop-blur-md border border-white/10 shadow-lg",
        "mx-auto flex justify-center w-[95%] max-w-[1200px] px-6",
        isScrolled ? "bg-secondary/20 text-primary" : "bg-transparent text-primary"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center h-14 justify-between w-full">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary">Hoodon.io</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium hover:text-primary transition-colors relative py-1",
                activeSection === item.href.slice(2) ? "text-primary" : "text-gray-600 dark:text-white dark:hover:text-primary",
              )}
              onClick={() => setActiveSection(item.href.slice(2))}
            >
              {item.name}
              {activeSection === item.href.slice(2) && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
          <Button
            variant="outline"
            className="rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            onClick={handleAccessAppButtonClick}
          >
            login
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-primary hover:bg-primary/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-primary/10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    setActiveSection(item.href.slice(2));
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 py-2">
                  <Button className="w-full rounded-full bg-primary text-white hover:bg-primary/90" onClick={handleAccessAppButtonClick}>
                    login
                  </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

