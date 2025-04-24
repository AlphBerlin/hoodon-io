"use client"

import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { BlobBackground } from "@/components/blob-background"

export default function ContactPage() {
  return (
      <div className="min-h-screen bg-secondary/10 dark:bg-background/50">
        <BlobBackground />
        {/* Hero Section */}
        <div className="py-20 text-center">
          <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 text-secondary-foreground dark:text-primary-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
              className="text-secondary-foreground/80 dark:text-primary-foreground/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
          >
            Have questions? We'd love to hear from you.
          </motion.p>
        </div>

        {/* Contact Grid */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white/10 dark:bg-secondary/5 rounded-lg p-6 backdrop-blur-sm border border-secondary/10 dark:border-secondary/5">
                <h2 className="text-xl font-semibold mb-6 text-secondary-foreground dark:text-primary-foreground">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 dark:bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary dark:text-primary/80" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-foreground/60 dark:text-primary-foreground/60">Email</p>
                      <p className="text-secondary-foreground dark:text-primary-foreground">info@hoodon.io</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 dark:bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary dark:text-primary/80" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-foreground/60 dark:text-primary-foreground/60">Phone</p>
                      <p className="text-secondary-foreground dark:text-primary-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 dark:bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary dark:text-primary/80" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-foreground/60 dark:text-primary-foreground/60">Address</p>
                      <p className="text-secondary-foreground dark:text-primary-foreground">123 Sport Street, CA 90210</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 dark:bg-secondary/5 rounded-lg p-6 backdrop-blur-sm border border-secondary/10 dark:border-secondary/5">
                <h2 className="text-xl font-semibold mb-6 text-secondary-foreground dark:text-primary-foreground">Business Hours</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground/60 dark:text-primary-foreground/60">Monday - Friday</span>
                    <span className="text-secondary-foreground dark:text-primary-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground/60 dark:text-primary-foreground/60">Saturday</span>
                    <span className="text-secondary-foreground dark:text-primary-foreground">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground/60 dark:text-primary-foreground/60">Sunday</span>
                    <span className="text-secondary-foreground dark:text-primary-foreground">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/10 dark:bg-secondary/5 rounded-lg p-6 backdrop-blur-sm border border-secondary/10 dark:border-secondary/5">
              <h2 className="text-xl font-semibold mb-6 text-secondary-foreground dark:text-primary-foreground">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary-foreground/60 dark:text-primary-foreground/60 mb-2 block">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                        type="text"
                        required
                        className="bg-white/5 dark:bg-secondary/10 border-secondary/20 dark:border-secondary/10 focus:border-primary/50 dark:focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-secondary-foreground/60 dark:text-primary-foreground/60 mb-2 block">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                        type="email"
                        required
                        className="bg-white/5 dark:bg-secondary/10 border-secondary/20 dark:border-secondary/10 focus:border-primary/50 dark:focus:border-primary/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-secondary-foreground/60 dark:text-primary-foreground/60 mb-2 block">
                    Subject <span className="text-destructive">*</span>
                  </label>
                  <Input
                      type="text"
                      required
                      className="bg-white/5 dark:bg-secondary/10 border-secondary/20 dark:border-secondary/10 focus:border-primary/50 dark:focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-secondary-foreground/60 dark:text-primary-foreground/60 mb-2 block">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                      rows={6}
                      required
                      className="bg-white/5 dark:bg-secondary/10 border-secondary/20 dark:border-secondary/10 focus:border-primary/50 dark:focus:border-primary/50"
                  />
                </div>
                <Button className="w-full md:w-auto" size="lg">
                  Send Message
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}