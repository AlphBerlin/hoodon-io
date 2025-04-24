'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BenefitsCarousel } from './benefits-carousel'

export function PlansSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <BenefitsCarousel />

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Weekly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-white rounded-3xl shadow-xl p-6 border border-gray-200"
          >
            <div className="absolute -top-3 right-4 bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">
              30% OFF
            </div>
            <div className="text-center mb-4">
              <div className="text-6xl text-black font-bold mb-1">7</div>
              <div className="text-2xl text-gray-600 mb-2">days</div>
              <div className="text-3xl font-bold text-gray-800">$6.99</div>
            </div>
          </motion.div>

          {/* Monthly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-primary text-white rounded-3xl shadow-xl p-6"
          >
            <div className="text-center mb-4">
              <div className="text-6xl font-bold mb-1">30</div>
              <div className="text-2xl opacity-90 mb-2">days</div>
              <div className="text-3xl font-bold">$13.99</div>
              <div className="text-sm opacity-75 mt-2">
                $13.99 will be charged every 30 days until canceled
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <Button
            size="lg"
            className="w-full max-w-md bg-primary hover:bg-primary/90 text-white rounded-full py-6 text-lg font-semibold"
          >
            Continue
          </Button>

          <p className="mt-6 text-sm text-gray-600 max-w-2xl mx-auto">
            Recurring billing, cancel anytime.
            By Tapping Continue, your subscription will automatically renew for the same
            package length at the same price until you cancel at least 24 hours prior to the end of
            the current period.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

