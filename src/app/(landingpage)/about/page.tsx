'use client'

import { motion } from "framer-motion"
import { Target, Shield, Users } from 'lucide-react'
import { BlobBackground } from "@/components/blob-background"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const stats = [
  { number: "40+", label: "Countries Served" },
  { number: "1M+", label: "Balls Produced" }
]

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "Committed to delivering professional-grade equipment that exceeds expectations."
  },
  {
    icon: Shield,
    title: "Quality",
    description: "Rigorous testing and premium materials ensure lasting performance."
  },
  {
    icon: Users,
    title: "Community",
    description: "Supporting athletes and teams at every level of the game."
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-secondary/10 text-secondary-foreground">
      <BlobBackground />
      
      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } }
              }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6"
                variants={fadeIn}
              >
                Our Mission
              </motion.h1>
              <motion.p 
                className="text-lg text-secondary-foreground/80 mb-8"
                variants={fadeIn}
              >
                At Hoodon.io, we're driven by a singular mission: to revolutionize video communication through cutting-edge innovation and unwavering commitment to privacy. We believe that every person deserves a secure and seamless way to connect with others that enhances their natural interactions and pushes the boundaries of what's possible in digital communication.
              </motion.p>
              
              <motion.div 
                className="grid grid-cols-2 gap-8"
                variants={fadeIn}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="bg-secondary-foreground/5 rounded-lg p-6 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-secondary-foreground/60">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src="/placeholder.png" 
                  alt="Video call illustration" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Values
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-secondary-foreground/5 rounded-lg p-6 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-secondary-foreground/80">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

