import React from 'react';
import { Card } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

const UseCasesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="use-cases" className="section-container bg-gray-50">
      <div className="text-center mb-16 reveal-animation">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('usecases.title')}</h2>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          {t('usecases.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card className="p-8 reveal-animation">
          <div className="mb-4 text-lg font-semibold">{t('usecases.advisors')}</div>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">1</div>
              <p>Advisor asks AI to find the best family vacation packages to Hawaii under $5,000.</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">2</div>
              <p>AI instantly searches and filters options from multiple providers, presenting the top 5 choices.</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">3</div>
              <p>Advisor reviews AI-generated comparison chart highlighting key differences.</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">4</div>
              <p>Advisor requests customization of selected package, which AI modifies and prices in real-time.</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">5</div>
              <p>AI generates a professional client proposal within seconds, ready for presentation.</p>
            </li>
          </ol>
        </Card>

        <Card className="p-8 reveal-animation">
          <div className="mb-4 text-lg font-semibold">{t('usecases.travelers')}</div>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">1</div>
              <p>Customer initiates conversation with booking assistant about European vacation options.</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">2</div>
              <p>AI asks a series of preference questions and proposes tailored itineraries.</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">3</div>
              <p>Customer selects preferred option and requests minor adjustments to dates and activities.</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">4</div>
              <p>AI processes modifications and presents updated pricing and availability.</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">5</div>
              <p>Customer completes booking and payment through secure integrated system.</p>
            </li>
          </ol>
        </Card>
      </div>
    </section>
  );
};

export default UseCasesSection;
