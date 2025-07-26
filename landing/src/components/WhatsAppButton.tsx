
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useWhatsAppButton } from '@/contexts/WhatsAppButtonContext';

const WhatsAppButton: React.FC = () => {
  const { t, language } = useLanguage();
  const { isHeroButtonVisible } = useWhatsAppButton();
  
  const phoneNumber = '573159381236'; // Número actualizado
  const message = encodeURIComponent(t('whatsapp.message'));
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed left-8 bottom-8 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110 group
              ${isHeroButtonVisible ? 'opacity-0 pointer-events-none transform translate-y-10' : 'opacity-100 pointer-events-auto transform translate-y-0'}`}
            aria-label={t('whatsapp.chat')}
          >
            <div className="absolute inset-0 rounded-full bg-green-500 opacity-40 animate-ping" />
            {/* WhatsApp SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 relative z-10"
            >
              <circle cx="12" cy="12" r="12" fill="#25D366" />
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.941 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.097 3.2 5.077 4.363.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 5.363h-.001a8.77 8.77 0 01-4.473-1.231l-.321-.191-3.326.868.889-3.24-.209-.332a8.725 8.725 0 01-1.334-4.627c.001-4.825 3.936-8.756 8.764-8.756 2.342 0 4.541.912 6.19 2.566a8.68 8.68 0 012.571 6.184c-.003 4.825-3.937 8.759-8.75 8.759zm7.149-15.909A10.449 10.449 0 0012.05 1.5C6.229 1.5 1.5 6.229 1.5 12.048c0 1.795.469 3.541 1.353 5.073L1.06 22.939a1 1 0 001.242 1.242l5.818-1.792a10.44 10.44 0 004.93 1.26h.004c5.819 0 10.548-4.729 10.548-10.547a10.41 10.41 0 00-3.058-7.634z"
                fill="#fff"
              />
            </svg>
            
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('whatsapp.chat')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WhatsAppButton;
