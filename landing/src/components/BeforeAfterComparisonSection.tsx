
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const BeforeAfterComparisonSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="problems" className="section-container">
      <div className="text-center mb-16 reveal-animation">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('problems.title')}</h2>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          {t('problems.description')}
        </p>
      </div>

      <div className="w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-4xl mx-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-primary">{t('problems.before')}</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                    <span>{t('problems.quotation.before.1')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                    <span>{t('problems.quotation.before.2')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                    <span>{t('problems.quotation.before.3')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                    <span>{t('problems.quotation.before.4')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                    <span>{t('problems.organization.before.1')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                    <span>{t('problems.organization.before.2')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                    <span>{t('problems.tracking.before.1')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                    <span>{t('problems.tracking.before.2')}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-green-600">{t('problems.after')}</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                    <span>{t('problems.quotation.after.1')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                    <span>{t('problems.quotation.after.2')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                    <span>{t('problems.quotation.after.3')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                    <span>{t('problems.quotation.after.4')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                    <span>{t('problems.organization.after.1')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                    <span>{t('problems.organization.after.2')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                    <span>{t('problems.tracking.after.1')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                    <span>{t('problems.tracking.after.2')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterComparisonSection;
