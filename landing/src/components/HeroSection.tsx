import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWhatsAppButton } from '@/contexts/WhatsAppButtonContext';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import WaitlistDialog from './WaitlistDialog';

const HeroSection: React.FC = () => {
  // Use the language context
  const { t } = useLanguage();

  // WhatsApp button visibility
  const whatsAppButtonRef = useRef<HTMLDivElement>(null);
  const { setIsHeroButtonVisible } = useWhatsAppButton();
  const isButtonVisible = useIntersectionObserver({
    elementRef: whatsAppButtonRef,
    threshold: 0.5,
  });

  useEffect(() => {
    setIsHeroButtonVisible(isButtonVisible);
  }, [isButtonVisible, setIsHeroButtonVisible]);

  // Scene state management
  const [currentScene, setCurrentScene] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  // Scene definitions
  const scenes = [
    { name: 'bogota', color: 'from-blue-300 to-blue-100', cloudColor: 'text-white', waveColor: 'text-blue-50' },
    { name: 'cartagena', color: 'from-amber-200 to-blue-200', cloudColor: 'text-white', waveColor: 'text-blue-100' },
    { name: 'medellin', color: 'from-indigo-900 to-purple-900', cloudColor: 'text-indigo-200', waveColor: 'text-indigo-800' },
    { name: 'tayrona', color: 'from-orange-400 to-pink-500', cloudColor: 'text-pink-100', waveColor: 'text-orange-100' },
    // New scenes
    { name: 'cali', color: 'from-orange-300 to-yellow-200', cloudColor: 'text-white', waveColor: 'text-yellow-100' },
    { name: 'santamarta', color: 'from-teal-400 to-blue-300', cloudColor: 'text-white', waveColor: 'text-teal-100' },
    { name: 'sanandres', color: 'from-blue-400 to-teal-300', cloudColor: 'text-white', waveColor: 'text-blue-200' },
  ];

  // Add state for waitlist dialog
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Scene transition effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);

      // Wait for fade out before changing scene
      setTimeout(() => {
        setCurrentScene((prev) => (prev + 1) % scenes.length);

        // Wait a moment then fade in the new scene
        setTimeout(() => {
          setTransitioning(false);
        }, 100);
      }, 500);
    }, 8000); // Change scene every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to scroll to contact form
  const scrollToContact = () => {
    setIsWaitlistOpen(true);
  };




  return (
    <section className="relative h-screen pt-28 pb-16 overflow-hidden">
      {/* Dynamic Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${scenes[currentScene].color} transition-opacity duration-500 ease-in-out ${transitioning ? 'opacity-0' : 'opacity-100'}`}
      ></div>

      {/* Scene Indicator */}
      <div className="absolute bottom-2 right-4 z-20 flex space-x-2">
        {scenes.map((scene, index) => (
          <div
            key={scene.name}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentScene ? 'bg-white scale-125' : 'bg-white/50'}`}
          ></div>
        ))}
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Decorative Wave - Bottom */}
        <svg
          className={`absolute bottom-0 left-0 w-full h-24 ${scenes[currentScene].waveColor} transition-colors duration-500`}
          viewBox="0 0 1440 120"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,80C672,85,768,75,864,69.3C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>

        {/* Scene-specific decorative elements */}
        {currentScene === 0 && (
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-white opacity-20 animate-pulse"></div>
        )}
        {currentScene === 1 && (
          <div className="absolute bottom-32 right-1/4 w-20 h-20 rounded-full bg-yellow-300 opacity-70 animate-pulse"></div>
        )}
        {currentScene === 2 && (
          <>
            <div className="absolute top-20 right-40 w-2 h-2 rounded-full bg-white opacity-80 animate-pulse"></div>
            <div className="absolute top-40 right-80 w-1 h-1 rounded-full bg-white opacity-90 animate-pulse-slow"></div>
            <div className="absolute top-60 right-20 w-2 h-2 rounded-full bg-white opacity-70 animate-pulse"></div>
            <div className="absolute top-80 right-60 w-1 h-1 rounded-full bg-white opacity-80 animate-pulse-slow"></div>
          </>
        )}
        {currentScene === 3 && (
          <div className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full bg-orange-500 opacity-40 animate-pulse-slow"></div>
        )}
        {/* New scene-specific elements for Cali */}
        {currentScene === 4 && (
          <>
            <div className="absolute top-1/5 right-1/4 w-32 h-32 rounded-full bg-orange-400 opacity-30 animate-float-slow"></div>
            <div className="absolute bottom-40 left-1/3 w-16 h-16 rounded-full bg-yellow-400 opacity-40 animate-float-medium"></div>
          </>
        )}
        {/* New scene-specific elements for Santa Marta */}
        {currentScene === 5 && (
          <>
            <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-blue-300 opacity-20 animate-float-medium"></div>
            <div className="absolute bottom-48 right-1/3 w-24 h-24 rounded-full bg-teal-300 opacity-30 animate-float-fast"></div>
          </>
        )}
        {/* New scene-specific elements for San Andrés */}
        {currentScene === 6 && (
          <>
            <div className="absolute top-1/3 left-1/3 w-40 h-40 rounded-full bg-teal-400 opacity-20 animate-float-slow"></div>
            <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-blue-500 opacity-30 animate-pulse"></div>
            <div className="absolute bottom-32 left-40 w-24 h-24 rounded-full bg-teal-200 opacity-40 animate-float-fast"></div>
          </>
        )}
      </div>

      <div className="container mx-auto px-4 md:px-8 relative h-[calc(100vh-7rem)] z-10">
        {/* Scene-specific text overlay */}
        <div className={`absolute top-4 right-10 text-sm font-medium transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-70'}`}>
          {currentScene === 0 && <span className="text-blue-800">{t('hero.city.bogota')}</span>}
          {currentScene === 1 && <span className="text-amber-800">{t('hero.city.cartagena')}</span>}
          {currentScene === 2 && <span className="text-white">{t('hero.city.medellin')}</span>}
          {currentScene === 3 && <span className="text-white">{t('hero.city.tayrona')}</span>}
          {currentScene === 4 && <span className="text-orange-800">{t('hero.city.cali')}</span>}
          {currentScene === 5 && <span className="text-teal-800">{t('hero.city.santamarta')}</span>}
          {currentScene === 6 && <span className="text-blue-800">{t('hero.city.sanandres')}</span>}
        </div>

        {/* Title - Top Left */}
        <div className="absolute top-12 md:top-0 md:left-10 max-w-xl md:max-w-xl">
          <h1 className={`text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-bold transition-colors duration-500 ${currentScene === 2 ? 'text-white' : ''}`}>
            {t('hero.title')}
          </h1>
        </div>

        {/* Image - Center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg md:max-w-xl lg:max-w-2xl">
          <img
            src="/hero.webp"
            alt="AI Travel Assistant"
            className="w-full animate-plane-float h-auto scale-125"
          />
        </div>

        {/* Description - Bottom Left */}
        <div className="absolute bottom-10 md:left-10 max-w-md md:max-w-lg">
          <p className={`text-base md:text-lg lg:text-xl transition-colors duration-500 ${currentScene === 2 ? 'text-white' : 'text-secondary'}`}>
            {t('hero.description')}
          </p>
        </div>

        {/* CTA Button - Bottom Right */}
        <div className="absolute bottom-10 right-10" ref={whatsAppButtonRef}>
          <Button
            className="bg-primary hover:bg-secondary hidden text-white text-base md:text-lg px-6 py-5 md:px-8 md:py-6 md:flex"
            onClick={scrollToContact}
          >
            {t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Mobile CTA Button - Bottom Center */}
        <div className="absolute bottom-[180px] left-0 right-0 flex justify-center md:hidden">
          <Button
            className="bg-primary hover:bg-secondary text-white text-base px-4"
            onClick={scrollToContact}
          >
            {t('hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Waitlist Dialog */}
      <WaitlistDialog open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} />
    </section>
  );
};

export default HeroSection;
