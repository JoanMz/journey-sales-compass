import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProblemCardProps {
  title: string;
  description: string;
  solution: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ title, description, solution }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg reveal-animation">
      <h3 className="text-xl font-bold mb-3 text-primary">{title}</h3>
      <p className="text-secondary mb-4">{description}</p>
      <div className="border-t pt-4">
        <span className="font-semibold text-primary">Our Solution:</span>
        <p className="text-secondary">{solution}</p>
      </div>
    </div>
  );
};

const ProblemsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="problems" className="section-container">
      <div className="text-center mb-16 reveal-animation">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('problems.title')}</h2>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          {t('problems.description')}
        </p>
      </div>

      {/* Keep existing problem cards - we'll add translations for them in a future iteration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProblemCard
          title="Information Overload"
          description="Travel advisors spend hours searching through countless options to find the right packages."
          solution="Our AI quickly filters and prioritizes options based on customer preferences."
        />
        <ProblemCard
          title="Customer Indecision"
          description="Travelers often struggle to make final booking decisions due to overwhelming choices."
          solution="Personalized recommendations that match exact preferences increase booking confidence."
        />
        <ProblemCard
          title="Inefficient Communication"
          description="Back-and-forth emails and calls waste valuable time for both advisors and clients."
          solution="Streamlined communication channels with immediate AI responses."
        />
        <ProblemCard
          title="After-Hours Support"
          description="Travel emergencies don't follow business hours, leaving customers stranded."
          solution="24/7 AI support that can handle most inquiries without human intervention."
        />
        <ProblemCard
          title="Keeping Up With Trends"
          description="Travel preferences and popular destinations change rapidly, making it hard to stay current."
          solution="Real-time market analysis and trend identification to keep offerings relevant."
        />
        <ProblemCard
          title="Payment Friction"
          description="Complex payment processes lead to abandoned bookings and lost revenue."
          solution="Simplified, secure payment flow integrated directly into the customer journey."
        />
      </div>
    </section>
  );
};

export default ProblemsSection;
