
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from 'react';
import WaitlistDialog from './WaitlistDialog';

type CarouselSlide = {
  image: string;
  description: string;
  title: string;
  alt: string;
};

const CRMIntegrationSection: React.FC = () => {
  const { t } = useLanguage();
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [activeSlide, setActiveSlide] = React.useState(0);

  // CRM Dashboard images with descriptions
  const crmSlides: CarouselSlide[] = [
    {
      image: "/lovable-uploads/87b0e882-0fa2-4475-932f-12b9ea2cae7f.png",
      title: t('crm.slides.slide1.title'),
      description: t('crm.slides.slide1.description'),
      alt: t('crm.slides.slide1.alt')
    },
    {
      image: "/lovable-uploads/c15a8878-7862-4395-92b5-f1cff742e5b0.png",
      title: t('crm.slides.slide2.title'),
      description: t('crm.slides.slide2.description'),
      alt: t('crm.slides.slide2.alt')
    },
    {
      image: "/lovable-uploads/2080a18a-8bc8-48ed-a0a6-0c509ac7fc2d.png",
      title: t('crm.slides.slide3.title'),
      description: t('crm.slides.slide3.description'),
      alt: t('crm.slides.slide3.alt')
    },
    {
      image: "/lovable-uploads/2a93b8a1-8682-419d-b375-1ad7f551b191.png",
      title: t('crm.slides.slide4.title'),
      description: t('crm.slides.slide4.description'),
      alt: t('crm.slides.slide4.alt')
    },
    {
      image: "/lovable-uploads/477c3a28-df0d-4b19-88e5-8b5e3af3ae20.png",
      title: t('crm.slides.slide5.title'),
      description: t('crm.slides.slide5.description'),
      alt: t('crm.slides.slide5.alt')
    },
    {
      image: "/lovable-uploads/b4eb495d-3b87-4cf5-908a-de29dedc7527.png",
      title: t('crm.slides.slide6.title'),
      description: t('crm.slides.slide6.description'),
      alt: t('crm.slides.slide6.alt')
    }
  ];

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const startAutoplay = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (carouselRef.current) {
          const api = (carouselRef.current as any)?.api;
          if (api) {
            if (api.canScrollNext()) {
              api.scrollNext();
              setActiveSlide((prev) => (prev + 1) % crmSlides.length);
            } else {
              api.scrollTo(0);
              setActiveSlide(0);
            }
          }
        }
      }, 4000); // 4 seconds interval
    };

    startAutoplay();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [crmSlides.length]);

  // Add state for waitlist dialog
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Function to scroll to contact form
  const scrollToContact = () => {
    setIsWaitlistOpen(true);
  };

  return (
    <>
      {/* CRM Integration */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 reveal-animation">{t('crm.title')}</h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-16 reveal-animation">
            {t('crm.description')}
          </p>

          <div className="reveal-animation max-w-5xl mx-auto">
            <Carousel
              className="w-full"
              ref={carouselRef}
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {crmSlides.map((slide, index) => (
                  <CarouselItem key={index} className="basis-full md:basis-full">
                    <Card className="border-none shadow-lg overflow-hidden">
                      <CardContent className="p-0 relative">
                        <img
                          src={slide.image}
                          alt={slide.alt}
                          className="w-full h-auto object-cover rounded-t-lg"
                        />
                        <div className="bg-black/80 text-white p-4 md:p-6 rounded-b-lg">
                          <h3 className="font-medium text-lg md:text-xl mb-1">{slide.title}</h3>
                          <p className="text-sm md:text-base text-gray-200">{slide.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 reveal-animation">{t('cta.title')}</h2>
            <p className="text-xl mb-8 reveal-animation">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 reveal-animation">
              <Button
                className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6 w-full sm:w-auto"
                onClick={() => window.open('https://wa.me/573159381236?text=Hola,%20estoy%20interesado%20en%20saber%20más%20sobre%20el%20asistente%20de%20ventas', '_blank')}
              >
                {t('cta.whatsapp')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                className="bg-white hover:bg-gray-100 text-primary text-lg px-8 py-6 w-full sm:w-auto"
                onClick={scrollToContact}
              >
                {t('cta.demo')}
              </Button>
            </div>
          </div>
        </div>
        {/* Waitlist Dialog */}
        <WaitlistDialog open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} />
      </section>
    </>
  );
};

export default CRMIntegrationSection;
