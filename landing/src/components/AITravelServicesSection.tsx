
import React, { useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Smartphone, Monitor } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ServiceItemProps {
  titleKey: string;
  descriptionKey: string;
  statisticKey: string;
  videoSrc?: string;
  placeholder?: string;
  index: number;
  isVertical?: boolean;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  titleKey,
  descriptionKey,
  statisticKey,
  videoSrc,
  placeholder,
  index,
  isVertical = false
}) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver({
    elementRef: containerRef,
    threshold: 0.5
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Auto-play was prevented:', error);
      });
    } else if (!isVisible && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  // Alternate layout direction based on index
  const isEven = index % 2 === 0;

  // Device frame component based on orientation
  const DeviceFrame = ({ children }: { children: React.ReactNode }) => {
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
    <div
      ref={containerRef}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16 ${index > 0 ? 'border-t border-gray-200' : ''} reveal-animation`}
    >
      {/* Content Section - Swap order based on index */}
      <div className={`${!isEven && !isMobile ? 'lg:order-2' : ''}`}>
        <h3 className="text-2xl md:text-3xl font-bold mb-4">{t(titleKey)}</h3>
        <p className="text-gray-600 mb-6 text-lg">{t(descriptionKey)}</p>
        <div className="bg-primary/10 p-4 inline-block rounded-lg">
          <p className="text-primary font-bold text-lg">{t(statisticKey)}</p>
        </div>
      </div>

      {/* Video Section - Swap order based on index */}
      <div className={`${!isEven && !isMobile ? 'lg:order-1' : ''} overflow-hidden mx-auto w-full`}>
        <DeviceFrame>
          {videoSrc ? (
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              muted
              playsInline
              loop
              // controls
              poster={placeholder || "https://via.placeholder.com/640x360?text=Video+Coming+Soon"}
            >
              <source src={videoSrc} type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white">
              <p>Video próximamente</p>
            </div>
          )}
        </DeviceFrame>
      </div>
    </div>
  );
};

const AITravelServicesSection: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      titleKey: "aitravel.quote.title",
      descriptionKey: "aitravel.quote.description",
      statisticKey: "aitravel.quote.statistic",
      videoSrc: "/lovable-uploads/phase1.mp4",
      placeholder: "",
      isVertical: true
    },
    {
      titleKey: "aitravel.confirm.title",
      descriptionKey: "aitravel.confirm.description",
      statisticKey: "aitravel.confirm.statistic",
      videoSrc: "/lovable-uploads/phase2.mp4",
      placeholder: "",
      isVertical: true
    },
    {
      titleKey: "aitravel.contracts.title",
      descriptionKey: "aitravel.contracts.description",
      statisticKey: "aitravel.contracts.statistic",
      videoSrc: "/lovable-uploads/phase3.MP4",
      placeholder: "",
      isVertical: true
    },
    // {
    //   titleKey: "aitravel.tracking.title",
    //   descriptionKey: "aitravel.tracking.description",
    //   statisticKey: "aitravel.tracking.statistic",
    //   videoSrc: "/lovable-uploads/phase4.mp4",
    //   placeholder: "",
    //   isVertical: true
    // }
  ];

  return (
    <section className="section-container py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 reveal-animation">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('aitravel.title')}</h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            {t('aitravel.description')}
          </p>
        </div>

        <div className="space-y-8">
          {services.map((service, index) => (
            <ServiceItem
              key={index}
              index={index}
              titleKey={service.titleKey}
              descriptionKey={service.descriptionKey}
              statisticKey={service.statisticKey}
              videoSrc={service.videoSrc}
              placeholder={service.placeholder}
              isVertical={service.isVertical}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AITravelServicesSection;
