import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, BarChart, Play, PresentationIcon, Users, ArrowRight } from 'lucide-react';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import WaitlistDialog from './WaitlistDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const Navigation: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close mobile menu when transitioning from mobile to desktop view
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  const openWaitlistDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWaitlistOpen(true);
  };

  // Device frame component based on orientation
  const DeviceFrame = ({ children, isVertical }: { children: React.ReactNode, isVertical?: boolean }) => {
    if (isVertical) {
      return (
        <div className="relative mx-auto ">
          {/* Mobile Phone Frame */}
          <div className="relative">
            {/* Phone Body */}
            <svg className="w-full bg max-w-[300px] mx-auto" viewBox="0 0 320 650" xmlns="http://www.w3.org/2000/svg">
              {/* Phone outline */}
              <rect x="10" y="10" width="300" height="630" rx="36" fill="#111827" stroke="#000" strokeWidth="2" />

              {/* Screen */}
              <rect x="22" y="60" width="276" height="530" rx="3" fill="#1f2937" />

              {/* Top speaker */}
              <rect x="130" y="35" width="60" height="6" rx="3" fill="#374151" />

              {/* Home button/indicator */}
              <rect x="145" y="610" width="30" height="6" rx="3" fill="#374151" />
            </svg>

            {/* Video content inside the phone screen */}
            <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-full h-[495px] overflow-hidden">
              {children}
            </div>

          </div>
        </div>
      );
    } else {
      return (
        <div className="relative mx-auto w-full">
          {/* Desktop/Laptop Frame */}
          <div className="relative w-full max-w-[1200px] mx-auto lg:w-[90%]">
            {/* Monitor/Laptop body */}
            <svg className="w-full" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
              {/* Monitor frame */}
              <rect x="10" y="5" width="620" height="320" rx="10" fill="#111827" stroke="#000" strokeWidth="2" />

              {/* Screen */}
              <rect x="20" y="15" width="600" height="300" rx="4" fill="#1f2937" />

              {/* Stand */}
              <path d="M270,325 L370,325 L390,350 L250,350 Z" fill="#111827" />
              <rect x="250" y="350" width="140" height="10" rx="3" fill="#374151" />
            </svg>

            {/* Content inside the monitor screen */}
            <div className="absolute top-[15px] left-[0px] right-[20px] bottom-[35px] overflow-hidden h-[84%] w-[100%] lg:h-auto">
              {children}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollPosition > 20 ? 'bg-primary shadow-md py-2' : 'bg-transparent py-4 md:py-6'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-white text-xl md:text-2xl">
            sellmoretrips.com
          </Link>

          <div className="flex items-center">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 mr-4">
              <a href="#problems" className="text-white hover:transform hover:-translate-y-1 transition-colors whitespace-nowrap drop-shadow-lg">{t('nav.problems')}</a>
              <a href="https://appsellmoretrips.pages.dev/" target="_blank" rel="noopener noreferrer" className=  "text-white hover:transform hover:-translate-y-1 cursor-pointer transition-colors whitespace-nowrap drop-shadow-lg">App</a>
              <a onClick={() => setIsDemoOpen(true)} className="text-white hover:transform hover:-translate-y-1 cursor-pointer transition-colors whitespace-nowrap drop-shadow-lg">Demo</a>
              <a onClick={() => setIsPitchOpen(true)} className="text-white hover:transform hover:-translate-y-1 cursor-pointer transition-colors whitespace-nowrap drop-shadow-lg">Pitch</a>
            </div>

            <div className="hidden md:block mr-4">
              <LanguageSwitcher />
            </div>

            <Button size="sm" className="hidden md:flex bg-white text-primary hover:bg-gray-100" onClick={openWaitlistDialog}>
              <span className="whitespace-nowrap">{t('nav.joinWaitlist')}</span>
            </Button>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <div className="mr-2">
                <LanguageSwitcher />
              </div>
              <button
                className="text-white focus:outline-none mobile-menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Demo Dialog */}
        <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Sell More Trips - Demo</DialogTitle>
            </DialogHeader>
            {/* <DeviceFrame isVertical={true}> */}
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/_HXrISQzDPk"
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            {/* </DeviceFrame> */}
          </DialogContent>
        </Dialog>

        {/* Pitch Dialog */}
        <Dialog open={isPitchOpen} onOpenChange={setIsPitchOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Sell More Trips - Pitch</DialogTitle>
            </DialogHeader>
            {/* <DeviceFrame isVertical={false}> */}
              <div className="aspect-video">
                <video
                  className="w-full h-full rounded-lg"
                  autoPlay
                  controls
                  src="/lovable-uploads/pitch_sellmoretrips.mp4"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            {/* </DeviceFrame> */}
          </DialogContent>
        </Dialog>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 mobile-menu-container flex flex-col space-y-4 bg-primary p-4 rounded-md">
            <a
              href="#problems"
              className="text-white hover:text-secondary transition-colors font-medium flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <AlertTriangle className="h-5 w-5" />
              {t('nav.problems')}
            </a>
            <a
              href="https://appsellmoretrips.pages.dev/" target="_blank" rel="noopener noreferrer"
              className="text-white cursor-pointer  hover:text-secondary transition-colors font-medium flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart className="h-5 w-5" />
              App
            </a>

            <a
              className="text-white cursor-pointer hover:text-secondary transition-colors font-medium flex items-center gap-2"
              onClick={() => setIsDemoOpen(true)}
            >
              <Play className="h-5 w-5" />
              Demo
            </a>
            <a
              className="text-white cursor-pointer hover:text-secondary transition-colors font-medium flex items-center gap-2"
              onClick={() => setIsPitchOpen(true)}
            >
              <PresentationIcon className="h-5 w-5" />
              Pitch
            </a>
            <a
              href="#team"
              className="text-white cursor-pointer hover:text-secondary transition-colors font-medium flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-5 w-5" />
              {t('nav.team')}
            </a>

            <Button
              className="bg-white hover:bg-gray-100 text-primary hover:text-primary text-base px-6 py-4 mt-2 flex items-center justify-center"
              onClick={(e) => {
                setIsMenuOpen(false);
                openWaitlistDialog(e);
              }}
            >
              {t('nav.joinWaitlist')} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Waitlist Dialog */}
      <WaitlistDialog open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} />
    </nav>
  );
};

export default Navigation;
