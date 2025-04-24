import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Video, Mail, Phone, MapPin } from 'lucide-react'
import Link from "next/link"
import {Icons} from "@/components/icons";

export function Footer() {
  return (
    <footer className="bg-secondary/30 text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Hoodon.io</span>
            </Link>
            <p className="text-sm text-secondary-foreground/80">
              Discover a world where you can express yourself freely with dynamic 3D Hoods, connect privately with those who matter, and let Cupid find your ideal match. Customize, connect, and stay authentic—all while keeping your identity secure. Join HoodOn.io and make every interaction truly yours!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#demo" className="text-sm hover:text-primary transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@hoodon.io</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+65 85315853</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Singapore, 403002</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Policy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li><li>
              <Link href="/terms-and-condition" className="text-sm hover:text-primary transition-colors">
                Terms and Condition
              </Link>
            </li>
            </ul>
          </div>
          {/* Newsletter */}
          {/*<div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-secondary-foreground/80 mb-4">
              Stay updated with our latest products and offers.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-secondary-foreground/10 border-secondary-foreground/20"
              />
              <Button>Subscribe</Button>
            </div>
          </div>*/}
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 text-center text-sm text-secondary-foreground/60">
          <p>© 2024 Hoodon.io. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

