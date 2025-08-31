import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es' | 'pt';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, Record<string, string>>;
  t: (key: string) => string;
};

const defaultTranslations = {
  'stats.moneyLoss': {
    en: 'You are losing up to $2 million USD per year by not providing personalized quotes on time.',
    es: 'Estás perdiendo hasta $2 millones usd al año por no cotizar de forma personalizada a tiempo.',
    pt: 'Você está perdendo até $2 milhões USD por ano por não fornecer cotações personalizadas no tempo certo.'
  },
  'stats.empowerTeam': {
    en: 'Power up your sales team with Artificial Intelligence, multiplying your revenue without multiplying your team:',
    es: 'Potencia tu equipo de ventas con Inteligencia Artificial, multiplicando tus ingresos sin multiplicar tu equipo:',
    pt: 'Potencialize sua equipe de vendas com Inteligência Artificial, multiplicando sua receita sem multiplicar sua equipe:'
  },
  'stats.sell3x': {
    en: 'Sell 3 times more',
    es: 'Vende 3 veces más',
    pt: 'Venda 3 vezes mais'
  },
  'stats.respond10x': {
    en: 'Respond 10 times faster',
    es: 'Responde 10 veces más rápido',
    pt: 'Responda 10 vezes mais rápido'
  },
  'stats.convert4x': {
    en: 'Convert 4 times more leads',
    es: 'Convierte 4 veces más leads',
    pt: 'Converta 4 vezes mais leads'
  },
  'stats.aiAgentGift': {
    en: 'And also... we gift you an AI salesperson:',
    es: 'Y además... te obsequiamos un vendedor de IA:',
    pt: 'E mais... presenteamos você com um vendedor de IA:'
  },
  'stats.works24_7': {
    en: 'Works 24/7, never gets tired and never leaves a customer unanswered.',
    es: 'Trabaja 24/7, nunca se cansa y jamás deja a un cliente sin respuesta.',
    pt: 'Trabalha 24/7, nunca se cansa e nunca deixa um cliente sem resposta.'
  },
  'stats.costEffective': {
    en: 'Costs less than a human salesperson and sells 3 times more.',
    es: 'Cuesta menos que un vendedor humano y vende 3 veces más.',
    pt: 'Custa menos que um vendedor humano e vende 3 vezes mais.'
  },
  'stats.finalMessage': {
    en: 'Respond better. Scale without hiring. Get the most out of your advertising investment',
    es: 'Responde mejor. Escala sin contratar. Exprime cada dólar de tu inversión en publicidad',
    pt: 'Responda melhor. Escale sem contratar. Aproveite ao máximo seu investimento em publicidade'
  },
  'hero.title': {
    en: 'Sell 3x More Trips with AI',
    es: 'Vende 3x más viajes con IA',
    pt: 'Venda 3x mais viagens com IA'
  },
  'hero.description': {
    en: 'Power up your sales team with AI, multiplying your revenue without expanding your team: Sell 3x more, respond 10x faster, convert 4x more leads.',
    es: 'Potencia tu equipo de ventas con IA, multiplicando tus ingresos sin multiplicar tu equipo: Vende 3x más, responde 10x más rápido, convierte 4x más leads.',
    pt: 'Potencialize sua equipe de vendas com IA, multiplicando sua receita sem expandir sua equipe: Venda 3x mais, responda 10x mais rápido, converta 4x mais leads.'
  },
  'hero.cta': {
    en: 'Connect with Us',
    es: 'Conéctate con Nosotros',
    pt: 'Conecte-se Conosco'
  },
  'hero.city.bogota': {
    en: 'Discover Bogotá',
    es: 'Descubre Bogotá',
    pt: 'Descubra Bogotá'
  },
  'hero.city.cartagena': {
    en: 'Enjoy Cartagena',
    es: 'Disfruta Cartagena',
    pt: 'Aproveite Cartagena'
  },
  'hero.city.medellin': {
    en: 'Explore Medellín',
    es: 'Explora Medellín',
    pt: 'Explore Medellín'
  },
  'hero.city.tayrona': {
    en: 'Experience Tayrona',
    es: 'Vive Tayrona',
    pt: 'Vivencie Tayrona'
  },
  'hero.city.cali': {
    en: 'Dance in Cali',
    es: 'Baila en Cali',
    pt: 'Dance em Cali'
  },
  'hero.city.santamarta': {
    en: 'Relax in Santa Marta',
    es: 'Relájate en Santa Marta',
    pt: 'Relaxe em Santa Marta'
  },
  'hero.city.sanandres': {
    en: 'Sail San Andrés',
    es: 'Navega San Andrés',
    pt: 'Navegue em San Andrés'
  },
  'nav.services': {
    en: 'Services',
    es: 'Servicios',
    pt: 'Serviços'
  },
  'nav.problems': {
    en: 'Problems',
    es: 'Problemas',
    pt: 'Problemas'
  },
  'nav.usecases': {
    en: 'Use Cases',
    es: 'Casos de Uso',
    pt: 'Casos de Uso'
  },
  'nav.faq': {
    en: 'FAQ',
    es: 'Preguntas',
    pt: 'Perguntas'
  },
  'nav.team': {
    en: 'Team',
    es: 'Equipo',
    pt: 'Equipe'
  },
  'nav.contact': {
    en: 'Contact Us',
    es: 'Contáctanos',
    pt: 'Contate-nos'
  },
  'nav.joinWaitlist': {
    en: 'Join Waitlist',
    es: 'Únete a la Lista',
    pt: 'Junte-se à Lista'
  },
  'services.title': {
    en: 'Our AI Travel Services',
    es: 'Nuestros Servicios de Viaje con IA',
    pt: 'Nossos Serviços de Viagem com IA'
  },
  'services.description': {
    en: 'Discover how our dual AI assistants can transform your travel business and delight your customers.',
    es: 'Descubre cómo nuestros asistentes de IA pueden transformar tu negocio de viajes y deleitar a tus clientes.',
    pt: 'Descubra como nossos assistentes de IA podem transformar seu negócio de viagens e encantar seus clientes.'
  },
  'services.advisor.title': {
    en: 'AI Travel Advisor Assistant',
    es: 'Asistente de Asesor de Viajes IA',
    pt: 'Assistente de Consultor de Viagens IA'
  },
  'services.advisor.description': {
    en: 'Help travel advisors quickly find the best deals and information for customers, reducing research time dramatically.',
    es: 'Ayuda a los asesores de viajes a encontrar rápidamente las mejores ofertas e información para los clientes, reduciendo drásticamente el tiempo de investigación.',
    pt: 'Ajude consultores de viagens a encontrar rapidamente as melhores ofertas e informações para clientes, reduzindo drasticamente o tempo de pesquisa.'
  },
  'services.booking.title': {
    en: 'Customer Booking Assistant',
    es: 'Asistente de Reserva para Clientes',
    pt: 'Assistente de Reserva para Clientes'
  },
  'services.booking.description': {
    en: 'Guide customers through the booking process, from searching for trips to payment and confirmation.',
    es: 'Guía a los clientes a través del proceso de reserva, desde la búsqueda de viajes hasta el pago y la confirmación.',
    pt: 'Guie os clientes através do processo de reserva, desde a busca de viagens até o pagamento e confirmação.'
  },
  'services.finder.title': {
    en: 'Smart Trip Finder',
    es: 'Buscador Inteligente de Viajes',
    pt: 'Localizador Inteligente de Viagens'
  },
  'services.finder.description': {
    en: 'Analyze thousands of options to find the perfect match for customer preferences and budget constraints.',
    es: 'Analiza miles de opciones para encontrar la combinación perfecta según preferencias y restricciones presupuestarias del cliente.',
    pt: 'Analise milhares de opções para encontrar a combinação perfeita para as preferências do cliente e restrições orçamentárias.'
  },
  'services.support.title': {
    en: '24/7 Customer Support',
    es: 'Soporte al Cliente 24/7',
    pt: 'Suporte ao Cliente 24/7'
  },
  'services.support.description': {
    en: 'Provide instant responses to common questions and concerns, even outside business hours.',
    es: 'Proporciona respuestas instantáneas a preguntas y preocupaciones comunes, incluso fuera del horario laboral.',
    pt: 'Forneça respostas instantâneas a perguntas e preocupações comuns, mesmo fora do horário comercial.'
  },
  'services.intelligence.title': {
    en: 'Market Intelligence',
    es: 'Inteligencia de Mercado',
    pt: 'Inteligência de Mercado'
  },
  'services.intelligence.description': {
    en: 'Stay ahead of trends and competition with AI-powered analytics and insights.',
    es: 'Mantente por delante de las tendencias y la competencia con análisis e insights impulsados por IA.',
    pt: 'Mantenha-se à frente das tendências e da concorrência com análises e insights baseados em IA.'
  },
  'services.payment.title': {
    en: 'Secure Payment Processing',
    es: 'Procesamiento de Pago Seguro',
    pt: 'Processamento de Pagamento Seguro'
  },
  'services.payment.description': {
    en: 'Facilitate safe and easy transactions between customers and travel providers.',
    es: 'Facilita transacciones seguras y fáciles entre clientes y proveedores de viajes.',
    pt: 'Facilite transações seguras e fáceis entre clientes e fornecedores de viagens.'
  },
  'problems.title': {
    en: 'Problems We\'re Solving',
    es: 'Problemas Que Estamos Resolviendo',
    pt: 'Problemas Que Estamos Resolvendo'
  },
  'problems.description': {
    en: 'The travel industry faces numerous challenges that our AI technology is uniquely positioned to address.',
    es: 'La industria de viajes enfrenta numerosos desafíos que nuestra tecnología de IA está en una posición única para abordar.',
    pt: 'A indústria de viajes enfrenta numerosos desafios que nossa tecnologia de IA está exclusivamente posicionada para resolver.'
  },
  'problems.tabs.quotation': {
    en: 'Quotations',
    es: 'Cotizaciones',
    pt: 'Cotações'
  },
  'problems.tabs.organization': {
    en: 'Organization',
    es: 'Organización',
    pt: 'Organização'
  },
  'problems.tabs.tracking': {
    en: 'Tracking',
    es: 'Seguimiento',
    pt: 'Acompanhamento'
  },
  'problems.before': {
    en: 'Before',
    es: 'Antes',
    pt: 'Antes'
  },
  'problems.after': {
    en: 'After',
    es: 'Después',
    pt: 'Depois'
  },
  'problems.quotation.before.1': {
    en: 'Manual quotations taking 30+ minutes',
    es: 'Cotizaciones manuales que toman 30+ minutos',
    pt: 'Cotações manuais que levam mais de 30 minutos'
  },
  'problems.quotation.before.2': {
    en: 'Errors in calculations and pricing',
    es: 'Errores en los cálculos y precios',
    pt: 'Erros nos cálculos e preços'
  },
  'problems.quotation.before.3': {
    en: 'Inconsistent formats',
    es: 'Formatos inconsistentes',
    pt: 'Formatos inconsistentes'
  },
  'problems.quotation.before.4': {
    en: 'Difficulty tracking progress',
    es: 'Dificultad para hacer seguimiento',
    pt: 'Dificuldade para fazer acompanhamento'
  },
  'problems.quotation.after.1': {
    en: 'Automated quotations in seconds',
    es: 'Cotizaciones automáticas en segundos',
    pt: 'Cotações automáticas em segundos'
  },
  'problems.quotation.after.2': {
    en: 'Precise calculations without errors',
    es: 'Cálculos precisos sin errores',
    pt: 'Cálculos precisos sem erros'
  },
  'problems.quotation.after.3': {
    en: 'Consistent professional format',
    es: 'Formato profesional consistente',
    pt: 'Formato profissional consistente'
  },
  'problems.quotation.after.4': {
    en: 'Automatic tracking and reminders',
    es: 'Seguimiento automático y recordatorios',
    pt: 'Acompanhamento automático e lembretes'
  },
  'problems.organization.before.1': {
    en: 'Mixed conversations with clients',
    es: 'Conversaciones mezcladas con clientes',
    pt: 'Conversas misturadas com clientes'
  },
  'problems.organization.before.2': {
    en: 'Information scattered in notes and chats',
    es: 'Información dispersa en notas y chats',
    pt: 'Informações dispersas em notas e chats'
  },
  'problems.organization.before.3': {
    en: 'Difficult to find customer history',
    es: 'Difícil encontrar historiales de clientes',
    pt: 'Difícil encontrar históricos de clientes'
  },
  'problems.organization.before.4': {
    en: 'No prospect categorization',
    es: 'Sin categorización de prospectos',
    pt: 'Sin categorización de leads'
  },
  'problems.organization.after.1': {
    en: 'Chats organized by client and stage',
    es: 'Chats organizados por cliente y etapa',
    pt: 'Chats organizados por cliente e fase'
  },
  'problems.organization.after.2': {
    en: 'All information centralized',
    es: 'Toda la información centralizada',
    pt: 'Todas as informações centralizadas'
  },
  'problems.organization.after.3': {
    en: 'Complete history and quick search',
    es: 'Historial completo y búsqueda rápida',
    pt: 'Histórico completo e busca rápida'
  },
  'problems.organization.after.4': {
    en: 'Automatic prospect classification',
    es: 'Clasificación automática de prospectos',
    pt: 'Classificação automática de leads'
  },
  'problems.tracking.before.1': {
    en: 'Inconsistent manual tracking',
    es: 'Seguimiento manual poco consistente',
    pt: 'Acompanhamento manual inconsistente'
  },
  'problems.tracking.before.2': {
    en: 'Potential clients are forgotten',
    es: 'Se olvidan clientes potenciales',
    pt: 'Clientes potenciales são esquecidos'
  },
  'problems.tracking.before.3': {
    en: 'No performance metrics',
    es: 'Sin métricas de desempeño',
    pt: 'Sin métricas de desempenho'
  },
  'problems.tracking.before.4': {
    en: 'Slow response times',
    es: 'Tiempos de respuesta lentos',
    pt: 'Tempos de resposta lentos'
  },
  'problems.tracking.after.1': {
    en: 'Automated tracking with reminders',
    es: 'Seguimiento automatizado con recordatorios',
    pt: 'Acompanhamento automatizado com lembretes'
  },
  'problems.tracking.after.2': {
    en: 'No client is left without attention',
    es: 'Ningún cliente se queda sin atención',
    pt: 'Nenhum cliente fica sem atenção'
  },
  'problems.tracking.after.3': {
    en: 'Dashboard with real-time metrics',
    es: 'Dashboard con métricas en tiempo real',
    pt: 'Dashboard com métricas em tempo real'
  },
  'problems.tracking.after.4': {
    en: 'Quick pre-configured responses',
    es: 'Respuestas rápidas preconfiguradas',
    pt: 'Respostas rápidas pré-configuradas'
  },
  'usecases.title': {
    en: 'How Our AI Works in Action',
    es: 'Cómo Funciona Nuestra IA en Acción',
    pt: 'Como Nossa IA Funciona em Ação'
  },
  'usecases.description': {
    en: 'Explore practical applications of our AI assistants in real-world travel scenarios.',
    es: 'Explora aplicaciones prácticas de nuestros asistentes de IA en escenarios de viaje del mundo real.',
    pt: 'Explore aplicações práticas dos nossos assistentes de IA em cenários de viagem do mundo real.'
  },
  'usecases.advisors': {
    en: 'For Travel Advisors',
    es: 'Para Asesores de Viajes',
    pt: 'Para Consultores de Viagens'
  },
  'usecases.travelers': {
    en: 'For Travelers',
    es: 'Para Viajeros',
    pt: 'Para Viajantes'
  },
  'process.step1.title': {
    en: 'Quotation',
    es: 'Cotización',
    pt: 'Cotação'
  },
  'process.step1.description': {
    en: 'Generate professional quotes automatically with just a few clicks',
    es: 'Genera cotizaciones profesionales automáticamente con solo unos clics',
    pt: 'Gere orçamentos profissionais automaticamente com apenas alguns cliques'
  },
  'process.step2.title': {
    en: 'Confirmation',
    es: 'Confirmación',
    pt: 'Confirmação'
  },
  'process.step2.description': {
    en: 'Process confirmations and payments directly through WhatsApp',
    es: 'Procesa confirmaciones y pagos directamente a través de WhatsApp',
    pt: 'Processe confirmações e pagamentos diretamente pelo WhatsApp'
  },
  'process.step3.title': {
    en: 'Documents',
    es: 'Documentos',
    pt: 'Documentos'
  },
  'process.step3.description': {
    en: 'Send itineraries and necessary documentation automatically',
    es: 'Envía itinerarios y documentación necesaria automáticamente',
    pt: 'Envie itinerários e documentação necessária automaticamente'
  },
  'process.step4.title': {
    en: 'Monitoring',
    es: 'Seguimiento',
    pt: 'Monitoramento'
  },
  'process.step4.description': {
    en: 'Keep your customers informed with scheduled updates',
    es: 'Mantén a tus clientes informados con actualizaciones programadas',
    pt: 'Mantenha seus clientes informados con actualizaciones programadas'
  },
  'whatsapp.experience.title': {
    en: 'Fluid WhatsApp Experience',
    es: 'Experiencia WhatsApp Fluida',
    pt: 'Experiência Fluida no WhatsApp'
  },
  'whatsapp.experience.instant.title': {
    en: 'Instant Responses',
    es: 'Respuestas instantáneas',
    pt: 'Respostas instantâneas'
  },
  'whatsapp.experience.instant.description': {
    en: 'Your customers receive immediate responses, even when you are busy with other matters.',
    es: 'Tus clientes reciben respuestas inmediatas, incluso cuando estás ocupado con otros asuntos.',
    pt: 'Seus clientes recebem respostas imediatas, mesmo quando você está ocupado com outros assuntos.'
  },
  'whatsapp.experience.personalization.title': {
    en: 'Automatic Personalization',
    es: 'Personalización automática',
    pt: 'Personalização automática'
  },
  'whatsapp.experience.personalization.description': {
    en: 'Each message adapts to the client, including their name and specific details of their inquiry.',
    es: 'Cada mensaje se adapta al cliente, incluyendo su nombre y detalles específicos de su consulta.',
    pt: 'Cada mensagem se adapta ao cliente, incluindo seu nome e detalhes específicos de sua consulta.'
  },
  'whatsapp.experience.languages.title': {
    en: 'Multiple Languages',
    es: 'Múltiples idiomas',
    pt: 'Múltiplos idiomas'
  },
  'whatsapp.experience.languages.description': {
    en: 'Communicate with international customers with support for English, Spanish and other languages.',
    es: 'Comunícate con clientes internacionales con soporte para español, inglés y otros idiomas.',
    pt: 'Comunique-se com clientes internacionais com suporte para português, inglês, espanhol e outros idiomas.'
  },
  'whatsapp.header.title': {
    en: 'Travel Assistant',
    es: 'Asistente de Viajes',
    pt: 'Assistente de Viagens'
  },
  'whatsapp.header.status': {
    en: 'typing...',
    es: 'escribiendo...',
    pt: 'digitando...'
  },
  'whatsapp.conversation.message1': {
    en: 'Hello, could you send me information about packages to Cancun?',
    es: 'Hola, ¿podrían enviarme información sobre paquetes a Cancún?',
    pt: 'Olá, poderia me enviar informações sobre pacotes para Cancún?'
  },
  'whatsapp.conversation.response1': {
    en: 'Hello! Of course, we have excellent options for Cancun. For how many people and on what dates are you thinking of traveling?',
    es: '¡Hola! Por supuesto, tenemos excelentes opciones para Cancún. ¿Para cuántas personas y en qué fechas estás pensando viajar?',
    pt: 'Olá! Claro, temos excelentes opções para Cancún. Para quantas pessoas e em quais datas você está pensando em viajar?'
  },
  'whatsapp.conversation.message2': {
    en: 'For 2 adults, from July 15 to 22',
    es: 'Para 2 adultos, del 15 al 22 de julio',
    pt: 'Para 2 adultos, de 15 a 22 de julho'
  },
  'whatsapp.conversation.response2': {
    en: 'Perfect! Here are our 3 best options for those dates:',
    es: '¡Perfecto! Aquí tienes nuestras 3 mejores opciones para esas fechas:',
    pt: 'Perfeito! Aqui estão nossas 3 melhores opções para essas datas:'
  },
  'whatsapp.conversation.quote': {
    en: '[PDF Quote] Cancun Options Jul 15-22',
    es: '[Cotización PDF] Opciones Cancún Jul 15-22',
    pt: '[Orçamento PDF] Opções Cancún Jul 15-22'
  },
  'whatsapp.conversation.message3': {
    en: 'Thank you! I\'m interested in option 2. How can I book?',
    es: '¡Gracias! Me interesa la opción 2. ¿Cómo puedo reservar?',
    pt: 'Obrigado! Estou interessado na opção 2. Como posso reservar?'
  },
  'crm.title': {
    en: 'Comprehensive CRM Integration',
    es: 'Integración Completa con CRM',
    pt: 'Integração Completa com CRM'
  },
  'crm.description': {
    en: 'Our platform seamlessly integrates with your existing CRM systems to streamline customer management and sales processes.',
    es: 'Nuestra plataforma se integra perfectamente con tus sistemas CRM existentes para optimizar la gestión de clientes y procesos de ventas.',
    pt: 'Nossa plataforma se integra perfeitamente com seus sistemas CRM existentes para otimizar o gerenciamento de clientes e processos de vendas.'
  },
  'crm.slides.slide1.title': {
    en: 'Customer Dashboard',
    es: 'Panel de Clientes',
    pt: 'Painel de Clientes'
  },
  'crm.slides.slide1.description': {
    en: 'Comprehensive view of all your customer information, travel preferences, and booking history in one place.',
    es: 'Vista completa de toda la información de tus clientes, preferencias de viaje e historial de reservas en un solo lugar.',
    pt: 'Visão completa de todas as informações dos seus clientes, preferências de viagem e histórico de reservas em um só lugar.'
  },
  'crm.slides.slide1.alt': {
    en: 'CRM Dashboard showing customer profiles and travel preferences',
    es: 'Panel de CRM mostrando perfiles de clientes y preferencias de viaje',
    pt: 'Painel de CRM mostrando perfis de clientes e preferências de viagem'
  },
  'crm.slides.slide2.title': {
    en: 'Sales Pipeline',
    es: 'Pipeline de Ventas',
    pt: 'Pipeline de Vendas'
  },
  'crm.slides.slide2.description': {
    en: 'Track potential deals from initial contact to booking confirmation with our intuitive sales pipeline.',
    es: 'Rastrea acuerdos potenciales desde el contacto inicial hasta la confirmación de reserva con nuestro intuitivo pipeline de ventas.',
    pt: 'Acompanhe negócios potenciais desde o contato inicial até a confirmação de reserva com nosso pipeline de vendas intuitivo.'
  },
  'crm.slides.slide2.alt': {
    en: 'Sales pipeline view showing travel deals at different stages',
    es: 'Vista de pipeline de ventas mostrando acuerdos de viaje en diferentes etapas',
    pt: 'Visualização do pipeline de vendas mostrando acordos de viagem em diferentes estágios'
  },
  'crm.slides.slide3.title': {
    en: 'Automated Marketing',
    es: 'Marketing Automatizado',
    pt: 'Marketing Automatizado'
  },
  'crm.slides.slide3.description': {
    en: 'Create targeted campaigns based on customer preferences and travel history to increase conversions.',
    es: 'Crea campañas dirigidas basadas en preferencias de clientes e historial de viajes para aumentar conversiones.',
    pt: 'Crie campanhas direcionadas com base nas preferências dos clientes e histórico de viagens para aumentar conversões.'
  },
  'crm.slides.slide3.alt': {
    en: 'Marketing automation dashboard with campaign analytics and customer segments',
    es: 'Panel de automatización de marketing con análisis de campañas y segmentos de clientes',
    pt: 'Painel de automação de marketing com análise de campanhas e segmentos de clientes'
  },
  'crm.slides.slide4.title': {
    en: 'Performance Analytics',
    es: 'Análisis de Rendimiento',
    pt: 'Análise de Desempenho'
  },
  'crm.slides.slide4.description': {
    en: 'Gain insights into sales performance, customer acquisition costs, and booking conversion rates.',
    es: 'Obtén información sobre el rendimiento de ventas, costos de adquisición de clientes y tasas de conversión de reservas.',
    pt: 'Obtenha insights sobre desempenho de vendas, custos de aquisição de clientes e taxas de conversão de reservas.'
  },
  'crm.slides.slide4.alt': {
    en: 'Performance analytics dashboard with key metrics and conversion data',
    es: 'Panel de análisis de rendimiento con métricas clave y datos de conversión',
    pt: 'Painel de análise de desempenho com métricas-chave e dados de conversão'
  },
  'crm.slides.slide5.title': {
    en: 'Task Management',
    es: 'Gestión de Tareas',
    pt: 'Gestão de Tarefas'
  },
  'crm.slides.slide5.description': {
    en: 'Efficiently manage follow-ups, reminders, and customer service tasks to ensure nothing falls through the cracks.',
    es: 'Gestiona eficientemente seguimientos, recordatorios y tareas de servicio al cliente para asegurar que nada se pase por alto.',
    pt: 'Gerencie com eficiência acompanhamentos, lembretes e tarefas de atendimento ao cliente para garantir que nada seja esquecido.'
  },
  'crm.slides.slide5.alt': {
    en: 'Task management interface showing schedules, reminders and task assignments',
    es: 'Interfaz de gestión de tareas mostrando horarios, recordatorios y asignaciones de tarefas',
    pt: 'Interface de gestão de tarefas mostrando horários, lembretes e atribuições de tarefas'
  },
  'crm.slides.slide6.title': {
    en: 'Customer Communication',
    es: 'Comunicación con Clientes',
    pt: 'Comunicação com Clientes'
  },
  'crm.slides.slide6.description': {
    en: 'Centralize all customer communications including emails, calls, and chat messages in one unified inbox.',
    es: 'Centraliza todas las comunicaciones con clientes incluyendo correos electrónicos, llamadas y mensajes de chat en una bandeja de entrada unificada.',
    pt: 'Centralize todas las comunicações con clientes, incluindo e-mails, chamadas y mensagens de chat em una caixa de entrada unificada.'
  },
  'crm.slides.slide6.alt': {
    en: 'Customer communication hub showing email, chat and call history',
    es: 'Centro de comunicación con clientes mostrando historial de correos, chats y llamadas',
    pt: 'Central de comunicação com clientes mostrando histórico de e-mails, chats e chamadas'
  },
  'cta.title': {
    en: 'Ready to boost your sales?',
    es: '¿Listo para impulsar tus ventas?',
    pt: 'Pronto para impulsionar suas vendas?'
  },
  'cta.description': {
    en: 'Start using our WhatsApp sales assistant today and transform your sales process.',
    es: 'Comienza a utilizar nuestro asistente de ventas por WhatsApp hoy mismo y transforma tu proceso de ventas.',
    pt: 'Comece a usar nosso assistente de vendas por WhatsApp hoje mesmo e transforme seu processo de vendas.'
  },
  'cta.whatsapp': {
    en: 'Contact via WhatsApp',
    es: 'Contactar por WhatsApp',
    pt: 'Contato via WhatsApp'
  },
  'cta.demo': {
    en: 'Request Demo',
    es: 'Solicitar Demo',
    pt: 'Solicitar Demo'
  },
  'whatsapp.chat': {
    en: 'Chat with us',
    es: 'Chatea con nosotros',
    pt: 'Converse conosco'
  },
  'whatsapp.message': {
    en: 'Hello, I would like more information about your travel services.',
    es: 'Hola, me gustaría más información sobre sus servicios de viaje.',
    pt: 'Olá, eu gostaria de mais informações sobre seus serviços de viagem.'
  },
  'faq.title': {
    en: 'Frequently Asked Questions',
    es: 'Preguntas Frecuentes',
    pt: 'Perguntas Frequentes'
  },
  'faq.description': {
    en: 'Find answers to common questions about our AI travel solutions',
    es: 'Encuentra respuestas a preguntas comunes sobre nuestras soluciones de viaje con IA',
    pt: 'Encontre respostas para perguntas comuns sobre nossas soluções de viagem com IA'
  },
  'faq.items.item1.question': {
    en: 'How does the AI advisor assistant work?',
    es: '¿Cómo funciona el asistente de IA para asesores?',
    pt: 'Como funciona o assistente de IA para consultores?'
  },
  'faq.items.item1.answer': {
    en: 'Our AI advisor assistant uses advanced natural language processing and machine learning to analyze thousands of travel options across multiple providers. It quickly filters results based on specific client requirements, price ranges, and preferences, presenting advisors with the most relevant options and saving hours of research time.',
    es: 'Nuestro asistente de IA para asesores utiliza procesamiento avanzado de lenguaje natural y aprendizaje automático para analizar miles de opciones de viaje de múltiples proveedores. Filtra rápidamente los resultados según los requisitos específicos del cliente, rangos de precios y preferencias, presentando a los asesores las opciones más relevantes y ahorrando horas de tiempo de investigación.',
    pt: 'Nosso assistente de IA para consultores usa processamento avançado de linguagem natural e aprendizado de máquina para analisar milhares de opções de viagem em vários provedores. Ele filtra rapidamente os resultados com base nos requisitos específicos do cliente, faixas de preço e preferências, apresentando aos consultores as opções mais relevantes e economizando horas de tempo de pesquisa.'
  },
  'faq.items.item2.question': {
    en: 'Is customer data kept secure?',
    es: '¿Se mantienen seguros los datos de los clientes?',
    pt: 'Os dados dos clientes são mantidos seguros?'
  },
  'faq.items.item2.answer': {
    en: 'Absolutely. We implement enterprise-grade security measures including encryption, secure authentication, and regular security audits. All customer data is protected in compliance with global privacy standards, and we never share personal information with third parties without explicit consent.',
    es: 'Absolutamente. Implementamos medidas de seguridad de nivel empresarial que incluyen cifrado, autenticación segura y auditorías de seguridad regulares. Todos los datos de los clientes están protegidos en cumplimiento con los estándares globales de privacidad, y nunca compartimos información personal con terceros sin consentimiento explícito.',
    pt: 'Absolutamente. Implementamos medidas de segurança de nível empresarial, incluindo criptografia, autenticação segura e auditorias regulares de segurança. Todos os dados dos clientes são protegidos em conformidade com os padrões globais de privacidade, e nunca compartilhamos informações pessoais com terceiros sem consentimento explícito.'
  },
  'faq.items.item3.question': {
    en: 'Can the AI handle complex itineraries?',
    es: '¿Puede la IA manejar itinerarios complejos?',
    pt: 'A IA consegue lidar com itinerários complexos?'
  },
  'faq.items.item3.answer': {
    en: 'Yes, our AI excels at managing complex multi-destination itineraries with various transportation methods, accommodation types, and activities. It can coordinate complicated logistics while optimizing for factors like cost, convenience, and customer preferences.',
    es: 'Sí, nuestra IA se destaca en la gestión de itinerarios complejos con múltiples destinos, diversos métodos de transporte, tipos de alojamiento y actividades. Puede coordinar logísticas complicadas mientras optimiza factores como costo, conveniencia y preferencias del cliente.',
    pt: 'Sim, nossa IA se destaca no gerenciamento de itinerários complexos com múltiplos destinos, vários métodos de transporte, tipos de acomodação e atividades. Ela pode coordenar logísticas complicadas enquanto otimiza fatores como custo, conveniência e preferências do cliente.'
  },
  'faq.items.item4.question': {
    en: 'How do payments work through the platform?',
    es: '¿Cómo funcionan los pagos a través de la plataforma?',
    pt: 'Como funcionam os pagamentos através da plataforma?'
  },
  'faq.items.item4.answer': {
    en: 'Our secure payment system integrates with major payment processors and provides multiple payment options for customers. The system handles deposits, installment payments, and full payments, with automated receipts and confirmation emails. Travel advisors receive immediate notification of completed transactions.',
    es: 'Nuestro sistema de pago seguro se integra con los principales procesadores de pago y proporciona múltiples opciones de pago para los clientes. El sistema maneja depósitos, pagos en cuotas y pagos completos, con recibos automatizados y correos electrónicos de confirmación. Los asesores de viaje reciben notificación inmediata de las transacciones completadas.',
    pt: 'Nosso sistema de pagamento seguro se integra com los principales processadores de pagamento e oferece múltiplas opções de pagamento para os clientes. O sistema gerencia depósitos, pagamentos parcelados e pagamentos completos, com recibos automatizados e e-mails de confirmação. Consultores de viagem recebem notificação imediata das transações concluídas.'
  },
  'faq.items.item5.question': {
    en: 'Can the AI assistant be customized for my travel business?',
    es: '¿Se puede personalizar el asistente de IA para mi negocio de viajes?',
    pt: 'O assistente de IA pode ser personalizado para o meu negócio de viagens?'
  },
  'faq.items.item5.answer': {
    en: 'Yes, our AI solutions are designed to be highly customizable. We can adapt the system to match your brand voice, preferred suppliers, commission structures, and business workflow. The AI learns from your business patterns over time, becoming increasingly tailored to your specific needs.',
    es: 'Sí, nuestras soluciones de IA están diseñadas para ser altamente personalizables. Podemos adaptar el sistema para que coincida con la voz de su marca, proveedores preferidos, estructuras de comisiones y flujo de trabajo comercial. La IA aprende de los patrones de su negocio con el tiempo, volviéndose cada vez más adaptada a sus necesidades específicas.',
    pt: 'Sim, nossas soluções de IA são projetadas para serem altamente personalizáveis. Podemos adaptar o sistema para corresponder à voz da sua marca, fornecedores preferidos, estruturas de comissão e fluxo de trabalho do negócio. A IA aprende com os padrões do seu negócio ao longo do tempo, tornando-se cada vez mais adaptada às suas necessidades específicas.'
  },
  'aitravel.title': {
    en: 'Our AI Travel Services',
    es: 'Nuestros Servicios de IA para Viajes',
    pt: 'Nossos Serviços de IA para Viagens'
  },
  'aitravel.description': {
    en: 'Discover how our AI assistants can transform your travel business and delight your customers.',
    es: 'Descubre cómo nuestros asistentes de IA pueden transformar tu negocio de viajes y deleitar a tus clientes.',
    pt: 'Descubra como nossos assistentes de IA podem transformar seu negócio de viagens e encantar seus clientes.'
  },
  'aitravel.quote.title': {
    en: 'Quote in Seconds',
    es: 'Cotiza en segundos',
    pt: 'Cotação em segundos'
  },
  'aitravel.quote.description': {
    en: 'Our algorithms find the flights and hotels that best match your travel plans and style. With a simple message, you\'ll receive flight and hotel options to start enjoying your trip sooner.',
    es: 'Nuestros algoritmos buscan el vuelo y el hotel que mas se ajuste a tus planes y estilo de viaje. Con un simple mensaje te devolvera el vuelo y el hotel para que inicies a disfrutar más rapido.',
    pt: 'Nossos algoritmos encontram voos e hotéis que melhor se adaptam aos seus planos e estilo de viagem. Com uma simples mensagem, você receberá opções de voo e hotel para começar a aproveitar sua viagem mais cedo.'
  },
  'aitravel.quote.statistic': {
    en: '90% faster than human agents',
    es: '90% más rapido que un humano',
    pt: '90% mais rápido que um humano'
  },
  'aitravel.confirm.title': {
    en: 'Confirm Your Trip',
    es: 'Confirma tu viaje',
    pt: 'Confirme sua viagem'
  },
  'aitravel.confirm.description': {
    en: 'Convert leads without clients leaving WhatsApp. With just a few more details, they can complete the sale and pay effortlessly via secure payment methods with the exact amount.',
    es: 'Convierte tus leads sin que tengan que salir de whatsapp. Con solo unos datos más pueden pasar al cierre de la venta y Paga sin complicaciones mediante pse con el monto exacto.',
    pt: 'Converta leads sem que os clientes precisem sair do WhatsApp. Com apenas alguns detalhes adicionais, eles podem concluir a venda e pagar sem esforço por métodos seguros com o valor exato.'
  },
  'aitravel.confirm.statistic': {
    en: '4X higher closing rate',
    es: '4X más alta la taza de cierre',
    pt: '4X taxa de fechamento mais alta'
  },
  'aitravel.contracts.title': {
    en: 'Instant Contracts and Invoices',
    es: 'Contratos y facturas al instante',
    pt: 'Contratos e faturas instantâneos'
  },
  'aitravel.contracts.description': {
    en: 'Automatically create legal contracts with your format and customer data, and generate accurate invoices when payments are validated.',
    es: 'Crea automáticamente contratos legales con tu formato y los datos de tu cliente y crea una factura correcta cuando los pagos están validados.',
    pt: 'Crie automaticamente contratos legais com seu formato e dados do cliente, e gere faturas precisas quando os pagamentos forem validados.'
  },
  'aitravel.contracts.statistic': {
    en: '11 hours saved per week',
    es: '11 horas ahorradas en la semana',
    pt: '11 horas economizadas por semana'
  },
  'aitravel.tracking.title': {
    en: 'Follow-up',
    es: 'Seguimiento',
    pt: 'Acompanhamento'
  },
  'aitravel.tracking.description': {
    en: 'Never lose a potential customer due to lack of organization. Centralize your agents and leads in our platform.',
    es: 'Nunca pierdas un potencial cliente por falta de organización, centraliza tus agentes y lead en nuestra plataforma',
    pt: 'Nunca perca um cliente potencial por falta de organização. Centralize seus agentes e leads em nossa plataforma.'
  },
  'crm.carousel.slide1.description': {
    en: 'Complete view of your sales performance and customer activity',
    es: 'Vista completa de tu rendimiento de ventas y actividad de clientes',
    pt: 'Visão completa do seu desempenho de vendas y atividade do cliente'
  },
  'crm.carousel.slide2.title': {
    en: 'Client Management',
    es: 'Gestión de Clientes',
    pt: 'Gestão de Clientes'
  },
  'crm.carousel.slide2.description': {
    en: 'Organize and track all client interactions in one place',
    es: 'Organiza y hace seguimiento a todas las interacciones con clientes en un solo lugar',
    pt: 'Organize e acompanhe todas as interações com clientes em um só lugar'
  },
  'crm.carousel.slide3.title': {
    en: 'Analytics Dashboard',
    es: 'Panel de Análisis',
    pt: 'Painel de Análise'
  },
  'crm.carousel.slide3.description': {
    en: 'Data-driven insights to optimize your sales process',
    es: 'Información basada en datos para optimizar tu proceso de ventas',
    pt: 'Insights baseados em dados para otimizar seu processo de vendas'
  },
  'waitlist.formTitle': {
    en: 'Join our Waitlist',
    es: 'Únete a nuestra Lista de Espera',
    pt: 'Junte-se à nossa Lista de Espera'
  },
  'waitlist.formDescription': {
    en: 'Fill out this form to get early access to our AI travel solutions',
    es: 'Completa este formulario para obtener acceso anticipado a nuestras soluciones de viaje con IA',
    pt: 'Preencha este formulário para obter acesso antecipado às nossas soluções de viagem com IA'
  },
  'waitlist.nameLabel': {
    en: 'Full Name',
    es: 'Nombre Completo',
    pt: 'Nome Completo'
  },
  'waitlist.namePlaceholder': {
    en: 'Enter your name',
    es: 'Ingresa tu nombre',
    pt: 'Digite seu nome'
  },
  'waitlist.emailLabel': {
    en: 'Email',
    es: 'Correo Electrónico',
    pt: 'Email'
  },
  'waitlist.emailPlaceholder': {
    en: 'Enter your email',
    es: 'Ingresa tu correo electrónico',
    pt: 'Digite seu email'
  },
  'waitlist.interestLabel': {
    en: 'Interest',
    es: 'Interés',
    pt: 'Interesse'
  },
  'waitlist.interestPlaceholder': {
    en: 'Describe your interest or how you plan to use our solution',
    es: 'Describe tu interés o cómo planeas usar nuestra solución',
    pt: 'Descreva seu interesse ou como planeja usar nossa solução'
  },
  'waitlist.phoneLabel': {
    en: 'Phone Number',
    es: 'Número de Teléfono',
    pt: 'Número de Telefone'
  },
  'waitlist.phonePlaceholder': {
    en: 'Enter your phone number',
    es: 'Ingresa tu número de teléfono',
    pt: 'Digite seu número de telefone'
  },
  'waitlist.submit': {
    en: 'Submit Request',
    es: 'Enviar Solicitud',
    pt: 'Enviar Solicitação'
  },
  'waitlist.submitting': {
    en: 'Submitting...',
    es: 'Enviando...',
    pt: 'Enviando...'
  },
  'waitlist.success': {
    en: 'Request Submitted',
    es: 'Solicitud Enviada',
    pt: 'Solicitação Enviada'
  },
  'waitlist.successMessage': {
    en: "Thank you for your interest! We'll contact you soon with more information.",
    es: "¡Gracias por tu interés! Te contactaremos pronto con más información.",
    pt: "Obrigado pelo seu interesse! Entraremos em contato em breve com mais informações."
  },
  'waitlist.error': {
    en: 'Submission Error',
    es: 'Error de Envío',
    pt: 'Erro de Envio'
  },
  'waitlist.errorRequired': {
    en: 'Please fill in all required fields',
    es: 'Por favor completa todos los campos requeridos',
    pt: 'Por favor, preencha todos os campos obrigatórios'
  },
  'waitlist.errorMessage': {
    en: 'There was an error submitting your request. Please try again.',
    es: 'Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.',
    pt: 'Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.'
  },
  // Team Section
  'team.title': {
    en: 'Our Team',
    es: 'Nuestro Equipo',
    pt: 'Nossa Equipe'
  },
  'team.description': {
    en: 'Meet the talented individuals behind our AI travel solutions',
    es: 'Conoce a las personas talentosas detrás de nuestras soluciones de viaje con IA',
    pt: 'Conheça os talentosos indivíduos por trás de nossas soluções de viagem com IA'
  },
  'team.role.ceo': {
    en: 'CEO',
    es: 'CEO',
    pt: 'CEO'
  },
  'team.role.cdo': {
    en: 'CDO',
    es: 'CDO',
    pt: 'CDO'
  },
  'team.role.cto': {
    en: 'CTO',
    es: 'CTO',
    pt: 'CTO'
  },
  'team.role.architect': {
    en: 'Solutions Architect',
    es: 'Arquitecto de soluciones',
    pt: 'Arquiteto de soluções'
  },
  'team.role.fullstack': {
    en: 'Senior Fullstack Engineer',
    es: 'Ingeniero senior Fullstack',
    pt: 'Engenheiro Fullstack sênior'
  },
  'team.role.ai': {
    en: 'AI Engineer',
    es: 'Ingeniero de IA',
    pt: 'Engenheiro de IA'
  },
  'aitravel.tracking.statistic': {
    en: '31+ customers recovered in a single day',
    es: '31+ clientes recuperados en un solo día',
    pt: '31+ clientes recuperados em um único dia'
  },
  'stats.title': {
    en: 'Impactful Results',
    es: 'Resultados Impactantes',
    pt: 'Resultados Impactantes'
  },
  'stats.increasedSales': {
    en: 'Sales increase',
    es: 'Aumento en ventas',
    pt: 'Aumento nas vendas'
  },
  'stats.timeSaved': {
    en: 'Time saved per week',
    es: 'Tiempo ahorrado por semana',
    pt: 'Tempo economizado por semana'
  },
  'stats.customerSatisfaction': {
    en: 'Customer satisfaction',
    es: 'Satisfacción del cliente',
    pt: 'Satisfação do cliente'
  },



  'contact.title': {
    en: 'Contact Us',
    es: 'Contáctanos',
    pt: 'Contate-nos'
  },
  'contact.description': {
    en: 'Get in touch with our team and discover how we can transform your travel business',
    es: 'Ponte en contacto con nuestro equipo y descubre cómo podemos transformar tu negocio de viajes',
    pt: 'Entre em contato com nossa equipe e descubra como podemos transformar seu negócio de viagens'
  },
  'contact.info.title': {
    en: 'Contact Information',
    es: 'Información de Contacto',
    pt: 'Informações de Contato'
  },
  'contact.info.description': {
    en: 'Have questions about our AI solutions? Fill out the form or contact us directly using the information below.',
    es: '¿Tienes preguntas sobre nuestras soluciones de IA? Completa el formulario o contáctanos directamente utilizando la información a continuación.',
    pt: 'Tem perguntas sobre nossas soluções de IA? Preencha o formulário ou contate-nos diretamente usando as informações abaixo.'
  },
  'contact.info.email.label': {
    en: 'Email',
    es: 'Correo Electrónico',
    pt: 'Email'
  },
  'contact.info.email.value': {
    en: 'manuel.gruezo@uao.edu.co',
    es: 'manuel.gruezo@uao.edu.co',
    pt: 'manuel.gruezo@uao.edu.co'
  },
  'contact.info.whatsapp.label': {
    en: 'WhatsApp',
    es: 'WhatsApp',
    pt: 'WhatsApp'
  },
  'contact.info.whatsapp.value': {
    en: '+573159381236',
    es: '+573159381236',
    pt: '+573159381236'
  },
  'contact.info.hours.label': {
    en: 'Office Hours',
    es: 'Horario de Oficina',
    pt: 'Horário de Funcionamento'
  },
  'contact.info.hours.value': {
    en: 'Monday to Friday, 9AM - 5PM EST',
    es: 'Lunes a Viernes, 9AM - 5PM EST',
    pt: 'Segunda a Sexta, 9AM - 5PM EST'
  },
  'crm.carousel.slide1.title': {
    en: 'Dashboard Overview',
    es: 'Vista general del Dashboard',
    pt: 'Visão geral do Dashboard'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translations: defaultTranslations,
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  // Initialize language from localStorage if available
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'es' || storedLanguage === 'pt')) {
      setLanguage(storedLanguage as Language);
    }
  }, []);
  
  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  const t = (key: string) => {
    if (defaultTranslations[key]?.[language]) {
      return defaultTranslations[key][language];
    }
    
    console.warn(`Translation missing for key: ${key} in language: ${language}`);
    return key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations: defaultTranslations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
