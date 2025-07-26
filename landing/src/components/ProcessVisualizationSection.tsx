
import React, { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { FileText, CheckSquare, FileCheck, BarChart3, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ProcessStep: React.FC<ProcessStepProps> = ({
  number,
  title,
  description,
  icon
}) => {
  return <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 reveal-animation">
      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 text-primary">
        {icon}
      </div>
    </div>;
};

// Mobile Phone Frame Component
const MobilePhoneFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative mx-auto">
      {/* Mobile Phone Frame */}
      <div className="relative">
        {/* Phone Body */}
        <svg className="w-full max-w-[280px] mx-auto" viewBox="0 0 320 650" xmlns="http://www.w3.org/2000/svg">
          {/* Phone outline */}
          <rect x="10" y="10" width="300" height="630" rx="36" fill="#111827" stroke="#000" strokeWidth="2" />
          
          {/* Screen */}
          <rect x="22" y="60" width="276" height="530" rx="3" fill="#1f2937" />
          
          {/* Top speaker */}
          <rect x="130" y="35" width="60" height="6" rx="3" fill="#374151" />
          
          {/* Home button/indicator */}
          <rect x="145" y="610" width="30" height="6" rx="3" fill="#374151" />
        </svg>
        
        {/* Content inside the phone screen */}
        <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[275px] h-[530px] overflow-hidden">
          {children}
        </div>
        
        {/* Mobile view label */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 z-10">
          <Smartphone size={14} />
          <span>WhatsApp</span>
        </div>
      </div>
    </div>
  );
};

const ProcessVisualizationSection: React.FC = () => {
  const {
    t
  } = useLanguage();
  const phoneImageRef = useRef(null);
  const isPhoneVisible = useIntersectionObserver({
    elementRef: phoneImageRef,
    threshold: 0.1
  });
  const isMobile = useIsMobile();
  
  return <section id="use-cases" className="section-container bg-gray-50">
      <div className="text-center mb-16 reveal-animation">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('usecases.title')}</h2>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          {t('usecases.description')}
        </p>
      </div>
      
      {/* Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        <ProcessStep number="1" title={t('process.step1.title')} description={t('process.step1.description')} icon={<FileText size={24} />} />
        <ProcessStep number="2" title={t('process.step2.title')} description={t('process.step2.description')} icon={<CheckSquare size={24} />} />
        <ProcessStep number="3" title={t('process.step3.title')} description={t('process.step3.description')} icon={<FileCheck size={24} />} />
        <ProcessStep number="4" title={t('process.step4.title')} description={t('process.step4.description')} icon={<BarChart3 size={24} />} />
      </div>
      
      {/* WhatsApp Experience Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-16">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 reveal-animation">{t('whatsapp.experience.title')}</h3>
          <div className="space-y-6 reveal-animation">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-xl mb-2">{t('whatsapp.experience.instant.title')}</h4>
              <p className="text-gray-600">{t('whatsapp.experience.instant.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-xl mb-2">{t('whatsapp.experience.personalization.title')}</h4>
              <p className="text-gray-600">{t('whatsapp.experience.personalization.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-xl mb-2">{t('whatsapp.experience.languages.title')}</h4>
              <p className="text-gray-600">{t('whatsapp.experience.languages.description')}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center lg:justify-end reveal-animation" ref={phoneImageRef}>
          <div className={`transform transition-all duration-1000 ${isPhoneVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="relative">
              <div className="chat-bubble absolute -top-10 -left-16 bg-green-500 text-white p-3 rounded-lg max-w-xs z-10">
                {t('whatsapp.conversation.message1')}
                <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-4 h-4 bg-green-500"></div>
              </div>
              
              <MobilePhoneFrame>
                {/* WhatsApp Interface with More Detailed Conversation */}
                <div className="h-full flex flex-col">
                  <div className="bg-green-500 p-3 flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full"></div>
                    <div className="ml-3">
                      <div className="text-white font-semibold">{t('whatsapp.header.title')}</div>
                      <div className="text-green-100 text-xs">{t('whatsapp.header.status')}</div>
                    </div>
                  </div>
                  <div className="flex-1 bg-[url()] p-2 overflow-y-auto">
                    <div className="mr-auto max-w-[70%] bg-white p-2 rounded-lg mb-2">
                      {t('whatsapp.conversation.message1')}
                    </div>
                    <div className="ml-auto max-w-[70%] bg-green-100 p-2 rounded-lg mb-2">
                      {t('whatsapp.conversation.response1')}
                    </div>
                    <div className="mr-auto max-w-[70%] bg-white p-2 rounded-lg mb-2">
                      {t('whatsapp.conversation.message2')}
                    </div>
                    <div className="ml-auto max-w-[70%] bg-green-100 p-2 rounded-lg mb-2">
                      {t('whatsapp.conversation.response2')}
                    </div>
                    <div className="ml-auto max-w-[70%] bg-green-100 p-2 rounded-lg">
                      {t('whatsapp.conversation.quote')}
                    </div>
                  </div>
                </div>
              </MobilePhoneFrame>
              
              <div className="chat-bubble absolute -bottom-12 -right-16 bg-white border border-gray-300 p-3 rounded-lg max-w-xs shadow-lg">
                {t('whatsapp.conversation.message3')}
                <div className="absolute top-0 left-8 transform -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-l border-t border-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default ProcessVisualizationSection;
