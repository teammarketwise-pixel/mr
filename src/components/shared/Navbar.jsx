import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { ArrowUpRight, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHero = location.pathname === '/' && !scrolled;

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profiel');
    } else {
      navigate('/toegang');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/60' : 'bg-black/30 backdrop-blur-md'
    }`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link to="/">
          <Logo dark={isHero} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works"
            className={`text-sm font-medium transition-colors ${isHero ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
            Hoe het werkt
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* Profile button */}
          <button
            onClick={handleProfileClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isHero
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-concrete hover:bg-border text-foreground'
            }`}
            title={isAuthenticated ? 'Mijn dashboard' : 'Inloggen'}
          >
            <User className="w-4 h-4" />
          </button>

          {/* CTA */}
          <button
            onClick={() => {
              sessionStorage.setItem('mr_login_next', '/planner');
              if (isAuthenticated) {
                navigate('/planner');
              } else {
                navigate('/toegang');
              }
            }}
            className="group flex items-center gap-1.5 bg-[#FFD700] text-[#0F172A] px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#FFD700]/90 hover:scale-[1.02] transition-all"
          >
            Start Gratis
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
}
