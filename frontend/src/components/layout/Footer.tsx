import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Github, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import numisnestLogo from '@/assets/numisnest-logo.png';

const exploreLinks = [
  { to: '/coins', label: 'Coin Catalog' },
  { to: '/coins?denomination=old_coin', label: 'Old Coins' },
  { to: '/coins?denomination=1_rupee', label: '₹1 Rupee Coins' },
  { to: '/coins?denomination=5_rupees', label: '₹5 Rupee Coins' },
  { to: '/coins?denomination=10_rupees', label: '₹10 Rupee Coins' },
  { to: '/articles', label: 'Articles' },
];

const infoLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/faq', label: 'FAQ' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-secondary text-secondary-foreground overflow-hidden">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_100%,hsl(var(--primary)/0.06),transparent)] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-5">
              <motion.img src={numisnestLogo} alt="NumisNest" className="w-10 h-10 object-contain"
                whileHover={{ rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }} />
              <span className="font-serif text-xl font-bold group-hover:text-primary transition-colors">NumisNest</span>
            </Link>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed mb-5">
              Preserving India's rich numismatic heritage. Explore rare coins from ancient
              civilizations to modern republic — each piece a story of our glorious past.
            </p>
            <a href="https://github.com/ShivamSharma43" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-secondary-foreground/50 hover:text-primary transition-colors">
              <Github className="w-3.5 h-3.5" />
              Built by Shivam Sharma
            </a>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-primary inline-block" />
              Explore
            </h4>
            <ul className="space-y-2.5">
              {exploreLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="group flex items-center gap-1.5 text-sm text-secondary-foreground/70 hover:text-primary transition-colors duration-200">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-primary inline-block" />
              Information
            </h4>
            <ul className="space-y-2.5">
              {infoLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="group flex items-center gap-1.5 text-sm text-secondary-foreground/70 hover:text-primary transition-colors duration-200">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-primary inline-block" />
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-secondary-foreground/70 leading-relaxed">Ranchi, Jharkhand, India</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                </div>
                <a href="mailto:official.numisnest@gmail.com"
                  className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                  official.numisnest@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                </div>
                <a href="tel:+919934368204"
                  className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                  +91 99343 68204
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-secondary-foreground/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-secondary-foreground/50 text-xs text-center sm:text-left max-w-lg">
              <strong className="text-secondary-foreground/70">Educational Platform:</strong>{' '}
              NumisNest is dedicated to the study of Indian numismatic history.
              Coin sales subject to inquiry and availability.
            </p>
            <p className="text-secondary-foreground/40 text-xs whitespace-nowrap">
              © {year} NumisNest. All rights reserved.
            </p>
            <p className="text-sm text-secondary-foreground/60 text-center">
              MADE WITH 🩷 BY{' '}
              <a href="https://github.com/ShivamSharma43" target="_blank" rel="noopener noreferrer"
                className="text-primary font-bold hover:underline transition-colors">
                SHIVAM SHARMA
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
