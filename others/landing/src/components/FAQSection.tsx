
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from '@/contexts/LanguageContext';

const FAQSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="faq" className="section-container">
      <div className="text-center mb-16 reveal-animation">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('faq.title')}</h2>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          {t('faq.description')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto reveal-animation">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">{t('faq.items.item1.question')}</AccordionTrigger>
            <AccordionContent>
              {t('faq.items.item1.answer')}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">{t('faq.items.item2.question')}</AccordionTrigger>
            <AccordionContent>
              {t('faq.items.item2.answer')}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">{t('faq.items.item3.question')}</AccordionTrigger>
            <AccordionContent>
              {t('faq.items.item3.answer')}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">{t('faq.items.item4.question')}</AccordionTrigger>
            <AccordionContent>
              {t('faq.items.item4.answer')}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">{t('faq.items.item5.question')}</AccordionTrigger>
            <AccordionContent>
              {t('faq.items.item5.answer')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
