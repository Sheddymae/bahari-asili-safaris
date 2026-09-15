import type { Locale } from '@/lib/i18n';

export type TravelerEssential = {
  title: string;
  text: string;
  href: string;
};

export type TravelerEssentialsTranslation = {
  label: string;
  title: string;
  subtitle: string;
  learnMore: string;
  items: TravelerEssential[];
};

export const travelerEssentialsTranslations: Record<Locale, TravelerEssentialsTranslation> = {
  en: {
    label: 'Travel Smart',
    title: 'Everything you need before you travel',
    subtitle: 'A quick planning guide for a smoother Kenya journey. Always confirm current entry, health and payment requirements before departure.',
    learnMore: 'Learn more',
    items: [
      { title: 'Entry & documents', text: 'Keep your passport, visa or entry authorization, travel insurance and booking documents together. Check official requirements before departure.', href: '/contact' },
      { title: 'When to travel', text: 'Plan around the experiences you want: wildlife, migration, beach time, culture or a combination of safari and coast.', href: '/destinations' },
      { title: 'What to pack', text: 'Light layers, comfortable shoes, sun protection, a reusable water bottle and essentials for changing safari and coastal conditions.', href: '/tours' },
      { title: 'Money & payments', text: 'Carry a practical payment option and a small amount of local currency. Confirm accepted payment methods before travelling.', href: '/contact' },
      { title: 'Health & comfort', text: 'Review current travel-health guidance, prescriptions and personal needs well before your journey.', href: '/contact' },
      { title: 'Plan your route', text: 'Combine parks, experiences and the coast into one route with realistic travel times between destinations.', href: '/build-your-safari' },
    ],
  },
  it: {
    label: 'Viaggia con Consapevolezza',
    title: 'Tutto ciò che ti serve prima di partire',
    subtitle: 'Una guida rapida per organizzare meglio il tuo viaggio in Kenya. Verifica sempre i requisiti aggiornati per ingresso, salute e pagamenti prima della partenza.',
    learnMore: 'Scopri di più',
    items: [
      { title: 'Ingresso e documenti', text: 'Tieni insieme passaporto, visto o autorizzazione d’ingresso, assicurazione di viaggio e documenti della prenotazione. Verifica i requisiti ufficiali prima della partenza.', href: '/contact' },
      { title: 'Quando viaggiare', text: 'Organizza il viaggio in base a ciò che desideri vivere: fauna, migrazione, mare, cultura oppure un mix di safari e costa.', href: '/destinations' },
      { title: 'Cosa mettere in valigia', text: 'Porta abiti leggeri a strati, scarpe comode, protezione solare, una borraccia riutilizzabile e l’essenziale per safari e costa.', href: '/tours' },
      { title: 'Denaro e pagamenti', text: 'Porta un metodo di pagamento pratico e una piccola somma in valuta locale. Verifica i metodi di pagamento accettati prima di partire.', href: '/contact' },
      { title: 'Salute e comfort', text: 'Controlla per tempo le indicazioni sanitarie di viaggio, le tue prescrizioni e le esigenze personali.', href: '/contact' },
      { title: 'Pianifica il percorso', text: 'Combina parchi, esperienze e costa in un unico itinerario con tempi di trasferimento realistici tra le destinazioni.', href: '/build-your-safari' },
    ],
  },
  fr: {
    label: 'Voyagez Malin',
    title: 'Tout ce dont vous avez besoin avant de partir',
    subtitle: 'Un guide rapide pour préparer un voyage au Kenya plus serein. Vérifiez toujours les exigences actuelles d’entrée, de santé et de paiement avant le départ.',
    learnMore: 'En savoir plus',
    items: [
      { title: 'Entrée et documents', text: 'Gardez ensemble votre passeport, visa ou autorisation d’entrée, assurance voyage et documents de réservation. Vérifiez les exigences officielles avant le départ.', href: '/contact' },
      { title: 'Quand voyager', text: 'Organisez votre séjour selon vos envies : faune, migration, plage, culture ou combinaison safari et côte.', href: '/destinations' },
      { title: 'Que mettre dans la valise', text: 'Prévoyez des vêtements légers superposables, des chaussures confortables, une protection solaire, une gourde réutilisable et l’essentiel pour le safari et la côte.', href: '/tours' },
      { title: 'Argent et paiements', text: 'Prévoyez un moyen de paiement pratique et un peu de monnaie locale. Vérifiez les moyens de paiement acceptés avant de voyager.', href: '/contact' },
      { title: 'Santé et confort', text: 'Consultez suffisamment à l’avance les recommandations sanitaires, vos ordonnances et vos besoins personnels.', href: '/contact' },
      { title: 'Planifiez votre itinéraire', text: 'Combinez parcs, expériences et côte dans un seul itinéraire avec des temps de trajet réalistes entre les destinations.', href: '/build-your-safari' },
    ],
  },
  es: {
    label: 'Viaja con Inteligencia',
    title: 'Todo lo que necesitas antes de viajar',
    subtitle: 'Una guía rápida para disfrutar de un viaje por Kenia más sencillo. Confirma siempre los requisitos actuales de entrada, salud y pagos antes de salir.',
    learnMore: 'Más información',
    items: [
      { title: 'Entrada y documentos', text: 'Guarda juntos tu pasaporte, visado o autorización de entrada, seguro de viaje y documentos de reserva. Comprueba los requisitos oficiales antes de viajar.', href: '/contact' },
      { title: 'Cuándo viajar', text: 'Planifica según las experiencias que buscas: fauna, migración, playa, cultura o una combinación de safari y costa.', href: '/destinations' },
      { title: 'Qué llevar', text: 'Lleva prendas ligeras, calzado cómodo, protección solar, una botella reutilizable y lo esencial para las condiciones cambiantes del safari y la costa.', href: '/tours' },
      { title: 'Dinero y pagos', text: 'Lleva un método de pago práctico y algo de moneda local. Confirma los métodos de pago aceptados antes del viaje.', href: '/contact' },
      { title: 'Salud y comodidad', text: 'Revisa con antelación las recomendaciones sanitarias de viaje, tus medicamentos y tus necesidades personales.', href: '/contact' },
      { title: 'Planifica tu ruta', text: 'Combina parques, experiencias y costa en una sola ruta con tiempos de traslado realistas entre destinos.', href: '/build-your-safari' },
    ],
  },
  de: {
    label: 'Clever Reisen',
    title: 'Alles, was Sie vor Ihrer Reise brauchen',
    subtitle: 'Ein kompakter Planungsleitfaden für eine entspanntere Kenia-Reise. Prüfen Sie vor der Abreise immer die aktuellen Einreise-, Gesundheits- und Zahlungsbestimmungen.',
    learnMore: 'Mehr erfahren',
    items: [
      { title: 'Einreise & Dokumente', text: 'Bewahren Sie Reisepass, Visum oder Einreisegenehmigung, Reiseversicherung und Buchungsunterlagen zusammen auf. Prüfen Sie die offiziellen Anforderungen vor der Abreise.', href: '/contact' },
      { title: 'Beste Reisezeit', text: 'Planen Sie nach den Erlebnissen, die Sie suchen: Tierwelt, Migration, Strand, Kultur oder eine Kombination aus Safari und Küste.', href: '/destinations' },
      { title: 'Was Sie einpacken sollten', text: 'Leichte Kleidung in Schichten, bequeme Schuhe, Sonnenschutz, eine wiederverwendbare Wasserflasche und das Nötigste für Safari und Küste.', href: '/tours' },
      { title: 'Geld & Zahlungen', text: 'Nehmen Sie eine praktische Zahlungsmöglichkeit und etwas lokale Währung mit. Prüfen Sie die akzeptierten Zahlungsmethoden vor der Reise.', href: '/contact' },
      { title: 'Gesundheit & Komfort', text: 'Informieren Sie sich rechtzeitig über aktuelle Reisegesundheitshinweise, Medikamente und persönliche Bedürfnisse.', href: '/contact' },
      { title: 'Route planen', text: 'Verbinden Sie Parks, Erlebnisse und Küste zu einer Route mit realistischen Fahrzeiten zwischen den Reisezielen.', href: '/build-your-safari' },
    ],
  },
  ar: {
    label: 'سافر بذكاء',
    title: 'كل ما تحتاجه قبل السفر',
    subtitle: 'دليل سريع للتخطيط لرحلة أكثر سلاسة في كينيا. تحقق دائمًا من متطلبات الدخول والصحة والدفع الحالية قبل المغادرة.',
    learnMore: 'اعرف المزيد',
    items: [
      { title: 'الدخول والوثائق', text: 'احتفظ بجواز السفر والتأشيرة أو تصريح الدخول وتأمين السفر ووثائق الحجز معًا. تحقق من المتطلبات الرسمية قبل المغادرة.', href: '/contact' },
      { title: 'متى تسافر', text: 'خطط وفق التجارب التي تريدها: الحياة البرية أو الهجرة أو الشاطئ أو الثقافة أو مزيج من السفاري والساحل.', href: '/destinations' },
      { title: 'ماذا تحزم', text: 'احزم ملابس خفيفة بطبقات وأحذية مريحة وواقيًا من الشمس وزجاجة مياه قابلة لإعادة الاستخدام والأساسيات المناسبة للسفاري والساحل.', href: '/tours' },
      { title: 'المال والمدفوعات', text: 'احمل وسيلة دفع عملية ومبلغًا صغيرًا من العملة المحلية. تأكد من طرق الدفع المقبولة قبل السفر.', href: '/contact' },
      { title: 'الصحة والراحة', text: 'راجع إرشادات صحة السفر الحالية والأدوية والاحتياجات الشخصية قبل رحلتك بوقت كافٍ.', href: '/contact' },
      { title: 'خطط مسارك', text: 'اجمع بين المتنزهات والتجارب والساحل في مسار واحد مع أوقات سفر واقعية بين الوجهات.', href: '/build-your-safari' },
    ],
  },
  zh: {
    label: '聪明旅行',
    title: '出发前需要了解的一切',
    subtitle: '快速规划指南，让您的肯尼亚之旅更加顺畅。出发前请务必确认最新的入境、健康和支付要求。',
    learnMore: '了解更多',
    items: [
      { title: '入境与证件', text: '请将护照、签证或入境许可、旅行保险和预订文件妥善放在一起。出发前确认官方最新要求。', href: '/contact' },
      { title: '何时出行', text: '根据您想体验的内容规划旅程：野生动物、大迁徙、海滩、文化，或将野生动物之旅与海岸结合。', href: '/destinations' },
      { title: '行李准备', text: '准备轻便的分层衣物、舒适的鞋子、防晒用品、可重复使用的水瓶，以及适合野生动物之旅和海岸天气的必需品。', href: '/tours' },
      { title: '资金与支付', text: '携带方便的支付方式和少量当地货币。出行前确认当地接受的支付方式。', href: '/contact' },
      { title: '健康与舒适', text: '提前了解最新旅行健康建议、处方药以及您的个人需求。', href: '/contact' },
      { title: '规划路线', text: '将国家公园、体验活动和海岸串联成一条路线，并为不同目的地之间预留合理的行车时间。', href: '/build-your-safari' },
    ],
  },
  sw: {
    label: 'Safiri kwa Busara',
    title: 'Kila kitu unachohitaji kabla ya kusafiri',
    subtitle: 'Mwongozo mfupi wa kupanga safari yako ya Kenya kwa urahisi zaidi. Thibitisha kila mara mahitaji ya sasa ya kuingia nchini, afya na malipo kabla ya kuondoka.',
    learnMore: 'Jifunze zaidi',
    items: [
      { title: 'Kuingia na nyaraka', text: 'Weka pamoja pasipoti, visa au kibali cha kuingia, bima ya safari na nyaraka za uhifadhi. Thibitisha mahitaji rasmi kabla ya kuondoka.', href: '/contact' },
      { title: 'Wakati wa kusafiri', text: 'Panga kulingana na uzoefu unaoutaka: wanyamapori, uhamaji, ufukwe, utamaduni au mchanganyiko wa safari na pwani.', href: '/destinations' },
      { title: 'Vitu vya kubeba', text: 'Beba nguo nyepesi za tabaka, viatu vizuri, kinga ya jua, chupa ya maji inayoweza kutumika tena na mahitaji muhimu kwa safari na pwani.', href: '/tours' },
      { title: 'Fedha na malipo', text: 'Beba njia rahisi ya malipo na kiasi kidogo cha fedha za ndani. Thibitisha njia za malipo zinazokubalika kabla ya kusafiri.', href: '/contact' },
      { title: 'Afya na starehe', text: 'Kagua mapema mwongozo wa sasa wa afya ya wasafiri, dawa zako na mahitaji yako binafsi.', href: '/contact' },
      { title: 'Panga njia yako', text: 'Unganisha mbuga, uzoefu na pwani katika njia moja yenye muda halisi wa kusafiri kati ya maeneo.', href: '/build-your-safari' },
    ],
  },
};
