
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Linkedin } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  linkedin: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, linkedin }) => {
  return (
    <div className="flex flex-col items-center reveal-animation">
      <div className="w-40 h-40 rounded-full overflow-hidden mb-4 relative">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-1/2 -translate-x-1/2 bottom-[1.5px] bg-blue-500 rounded-full p-1 shadow-lg hover:bg-blue-600 transition-colors"
          aria-label={`LinkedIn de ${name}`}
        >
          <Linkedin className="w-6 h-6 text-white fill-white" />
        </a>
      </div>
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-secondary">{role}</p>
    </div>
  );
};

const TeamSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="team" className="section-container">
      <div className="text-center mb-16 reveal-animation">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('team.title')}</h2>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          {t('team.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-center items-center">

        <TeamMember
          name="Sofia Salinas"
          role={t('team.role.cto')}
          image="public\lovable-uploads\sofia.jpeg"
          linkedin="https://www.linkedin.com/in/sofiasalinasrico/"
        />
        <TeamMember
          name="Manuel Alejandro Gruezo"
          role={t('team.role.ceo')}
          image="public\lovable-uploads\manuel.jpeg"
          linkedin="https://www.linkedin.com/in/manuel-alejandro-gruezo-perlaza-bb1970255/"
        />
        <TeamMember
          name="Gustavo Chipantiza"
          role={t('team.role.cdo')}
          image="public\lovable-uploads\gustavo.jpeg"
          linkedin="https://www.linkedin.com/in/gustavo-chipantiza-09a095238/"
        />
        <TeamMember
          name="Joan Mateo Bermudez"
          role={t('team.role.architect')}
          image="public\lovable-uploads\mateo.jpeg"
          linkedin="https://www.linkedin.com/in/joan-mateo-bermudez-collazos-a764b2232/"
        />
        <TeamMember
          name="Daniel Rivera Yepes"
          role={t('team.role.ai')}
          image="public\lovable-uploads\daniel.jpeg"
          linkedin="https://www.linkedin.com/in/danrivera9/"
        />
        <TeamMember
          name="Miguel Muñoz"
          role={t('team.role.ai')}
          image="https://media.licdn.com/dms/image/v2/D4E03AQHdFN7Rq-1eJg/profile-displayphoto-shrink_400_400/B4EZaS3KiIHMAg-/0/1746220657163?e=1752105600&v=beta&t=bkvHx0VzCIV4pNAFWA2hmYf4ewohGTlHjXve4oP4C-Q"
          linkedin="https://www.linkedin.com/in/miguel-mu%C3%B1oz-514069283/"
        />
        <TeamMember
          name="Gregson Murcia "
          role={t('team.role.fullstack')}
          image="public\lovable-uploads\greg.jpeg"
          linkedin="https://www.linkedin.com/in/gregson-murcia-castro-b527a31a6/"
        />
      </div>
    </section>
  );
};

export default TeamSection;
