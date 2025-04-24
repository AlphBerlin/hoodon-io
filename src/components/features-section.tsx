"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Video, Shield, MessageCircle, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {BiMoney} from "react-icons/bi";
import {PiMoney} from "react-icons/pi";

const features = [
  {
    title: "Anonymous Video Calls",
    description: "Connect face-to-face without revealing your identity. Our advanced encryption ensures your privacy.",
    icon: Video,
  },
  {
    title: "Completely Free",
    description: "Connect with Anyone for free",
    icon: PiMoney,
  },
  {
    title: "Privacy First",
    description: "Your security is our top priority. No data collection, no tracking, just pure anonymous communication.",
    icon: Shield,
  },
  {
    title: "Seamless Experience",
    description: "Enjoy a smooth, intuitive interface designed for effortless communication.",
    icon: Zap,
  },
];

export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="features" className="py-24 bg-secondary/30">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container mx-auto px-4"
      >
        <div className="text-center mb-16">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Why Choose Hoodon.io?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Experience the future of private communication with our cutting-edge features
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

