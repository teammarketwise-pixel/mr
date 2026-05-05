import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/landing/HeroSection';
import OOHPowerSection from '@/components/landing/OOHPowerSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import WhyMarketRise from '@/components/landing/WhyMarketRise';
import MiniContactForm from '@/components/landing/MiniContactForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <OOHPowerSection />
      <HowItWorksSection />
      <WhyMarketRise />
      <MiniContactForm />
      <Footer />
    </div>
  );
}
