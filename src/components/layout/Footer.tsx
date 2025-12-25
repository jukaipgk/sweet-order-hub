import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Cake className="w-5 h-5" />
              </div>
              <span className="font-display text-2xl font-semibold">Kue Manis</span>
            </Link>
            <p className="text-primary-foreground/80 font-body text-sm leading-relaxed">
              Kue berkualitas tinggi untuk momen spesial Anda. Dibuat dengan cinta dan bahan-bahan terbaik.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Menu</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Beranda
              </Link>
              <Link to="/catalog" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Katalog
              </Link>
              <Link to="/track" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Lacak Pesanan
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-primary-foreground/80">
                  Jl. Sudirman No. 123, Jakarta Pusat
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 shrink-0" />
                <span className="text-primary-foreground/80">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 shrink-0" />
                <span className="text-primary-foreground/80">09:00 - 17:00 WIB</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Ikuti Kami</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Kue Manis. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
