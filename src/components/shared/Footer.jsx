import React from 'react';
import Logo from './Logo';
import { Mail, Phone, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-6 text-sm text-muted-foreground max-w-sm">
              De onafhankelijke specialist voor Out-of-Home advertising.
              Wij helpen u de perfecte locaties te vinden binnen uw budget.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/marketrise.team"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-concrete flex items-center justify-center hover:bg-[#FFD700] transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-[#0F172A]" />
              </a>
              <a
                href="https://www.linkedin.com/company/marketrise"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-concrete flex items-center justify-center hover:bg-[#FFD700] transition-colors group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-[#0F172A]" />
              </a>
              <a
                href="mailto:Team.MarketRise@hotmail.com"
                className="w-9 h-9 rounded-full bg-concrete flex items-center justify-center hover:bg-[#FFD700] transition-colors group"
                aria-label="E-mail"
              >
                <Mail className="w-4 h-4 text-muted-foreground group-hover:text-[#0F172A]" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-clash font-semibold text-sm mb-4 uppercase tracking-wider">Navigatie</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">Hoe het werkt</a></li>
              <li><a href="/planner" className="hover:text-foreground transition-colors">Wizard</a></li>
              <li><a href="/snel-zoeken" className="hover:text-foreground transition-colors">Snel zoeken</a></li>
              <li><a href="/mijn-claims" className="hover:text-foreground transition-colors">Mijn claims</a></li>
              <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-clash font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="mailto:Team.MarketRise@hotmail.com" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#FFD700]" />
                  Team.MarketRise@hotmail.com
                </a>
              </li>
              <li>
                <a href="tel:+32474199408" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#FFD700]" />
                  +32 474 19 94 08
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/marketrise.team" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5 text-[#FFD700]" />
                  @marketrise.team
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/marketrise" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 text-[#FFD700]" />
                  MarketRise
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Market Rise. All rights reserved.</p>
          <div />
        </div>
      </div>
    </footer>
  );
}
