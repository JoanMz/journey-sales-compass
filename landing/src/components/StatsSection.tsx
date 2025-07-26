
import React from 'react';
import AnimatedCounter from './AnimatedCounter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Rocket, Zap, UserPlus } from 'lucide-react';

const StatsSection: React.FC = () => {
  // Use the language context
  const { t } = useLanguage();
    
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 reveal-animation">{t('stats.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <AnimatedCounter value="40" suffix="%" label={t('stats.increasedSales')} />
          <AnimatedCounter value="15" suffix=" hrs" label={t('stats.timeSaved')} />
          <AnimatedCounter value="90" suffix="%" label={t('stats.customerSatisfaction')} />
        </div>
        
        {/* New content block */}
        <div className="mt-20 max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 reveal-animation">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-primary text-center">
            {t('stats.moneyLoss')}
          </h3>
          
          <p className="text-lg mb-8 text-center">
            {t('stats.empowerTeam')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <Rocket className="mx-auto mb-2 text-green-500 h-7 w-7" />
              <p className="font-bold h-12 text-xl mb-2 text-primary">{t('stats.sell3x')}</p>
            </div>
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <Zap className="mx-auto mb-2 text-green-500 h-7 w-7" />
              <p className="font-bold h-12 text-xl mb-2 text-primary">{t('stats.respond10x')}</p>
            </div>
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <UserPlus className="mx-auto mb-2 text-green-500 h-7 w-7" />
              <p className="font-bold h-12 text-xl mb-2 text-primary">{t('stats.convert4x')}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl">
            <h4 className="text-xl md:text-2xl font-bold mb-4 text-center">
              {t('stats.aiAgentGift')}
            </h4>
            <ul className="space-y-3 text-lg">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span>{t('stats.works24_7')}</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                <span>{t('stats.costEffective')}</span>
              </li>
            </ul>
          </div>
          
          <p className="text-lg font-medium text-center mt-8 text-primary">
            {t('stats.finalMessage')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
