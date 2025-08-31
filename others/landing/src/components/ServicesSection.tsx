
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceCardProps {
  titleKey: string;
  descriptionKey: string;
  icon: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ titleKey, descriptionKey, icon }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 reveal-animation">
      <div className="mb-6 text-4xl text-primary">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{t(titleKey)}</h3>
      <p className="text-secondary mb-4">{t(descriptionKey)}</p>
      <a href="#contact" className="inline-flex items-center text-primary hover:text-secondary">
        Learn more <ArrowRight className="ml-1 h-4 w-4" />
      </a>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="services" className="section-container bg-gray-50">
      <div className="text-center mb-16 reveal-animation">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('services.title')}</h2>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          {t('services.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ServiceCard
          icon="✈️"
          titleKey="services.advisor.title"
          descriptionKey="services.advisor.description"
        />
        <ServiceCard
          icon="🏨"
          titleKey="services.booking.title"
          descriptionKey="services.booking.description"
        />
        <ServiceCard
          icon="🔍"
          titleKey="services.finder.title"
          descriptionKey="services.finder.description"
        />
        <ServiceCard
          icon="💬"
          titleKey="services.support.title"
          descriptionKey="services.support.description"
        />
        <ServiceCard
          icon="📊"
          titleKey="services.intelligence.title"
          descriptionKey="services.intelligence.description"
        />
        <ServiceCard
          icon="🔐"
          titleKey="services.payment.title"
          descriptionKey="services.payment.description"
        />
      </div>
    </section>
  );
};

export default ServicesSection;
