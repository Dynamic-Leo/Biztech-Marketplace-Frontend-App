import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/803cc2ffb6349e8daa522fcf852a00da8323a916.png';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="BizTech Logo" className="w-6 h-6" />
              <span className="metric" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Biz Marketplace
              </span>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Global platform connecting businesses for partnerships, collaborations, and opportunities. Connect. Compete. Collaborate.
            </p>
            <div className="text-sm opacity-60">
              © {new Date().getFullYear()} BizTech
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4" style={{ fontSize: '1rem' }}>Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/search" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                Browse Listings
              </Link>
              <Link to="/valuation" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                Business Valuation
              </Link>
              <Link to="/how-it-works" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                How It Works
              </Link>
              <Link to="/pricing" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                Pricing
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white mb-4" style={{ fontSize: '1rem' }}>Legal</h3>
            <div className="flex flex-col gap-2">
              <Link to="/terms" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                Privacy Policy
              </Link>
              <Link to="/commission" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                Commission Structure
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4" style={{ fontSize: '1rem' }}>Contact Us</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2 text-sm opacity-80">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>
                  Office No 06, Level 26th, Aspin Commercial Tower, Sheikh Zayed Road, Dubai, UAE
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Phone className="w-4 h-4" />
                <a href="tel:00971521205514" className="hover:opacity-100">
                  00971-52-120-5514
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Mail className="w-4 h-4" />
                <a href="mailto:services@biztech.ae" className="hover:opacity-100">
                  services@biztech.ae
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-sm opacity-60">
            License No: 1417533 | BizTech
          </p>
        </div>
      </div>
    </footer>
  );
};