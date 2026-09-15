import type { Excursion } from '@/lib/tours-data';

export type SupportedLocale = 'en' | 'it' | 'fr' | 'es' | 'de' | 'ar' | 'zh' | 'sw';

type LocalizedExcursion = {
  name: string;
  description: string;
  duration: string;
  startingLocation: string;
  highlights: string[];
  whatToExpect: string[];
  included: string[];
  notIncluded: string[];
  goodToKnow: string[];
};

const names: Record<Exclude<SupportedLocale, 'en'>, Record<string, string>> = {
  it: {
    'safari-blu-mida': 'Safari Blu — Mida Creek', 'safari-blu-sardegna': 'Safari Blu — Isola Sardegna 2', 'isola-amore': "Isola dell'Amore", 'robinson-golden': 'Isola di Robinson e Golden Beach', 'mangrovie-canoa': 'Canoa tra le mangrovie — Mida Creek', 'gede-ruins': 'Rovine di Gede', 'marafa-kitchen': "Marafa Hell's Kitchen", 'malindi-town': 'Tour della città di Malindi', 'dabaso-village': 'La vera Africa — Villaggio Dabaso', 'dolphin-turtle-swim': 'Nuoto con delfini e tartarughe', 'deep-sea-fishing': "Pesca d'altura", 'arabuko-sokoke-forest': 'Passeggiata nella foresta di Arabuko-Sokoke', 'kitesurfing-lesson': 'Lezione di kitesurf', 'sunset-dhow-cruise': 'Crociera al tramonto in dhow', 'falconry-of-kenya': 'Falconeria del Kenya', 'mambrui-sand-dunes': 'Dune di sabbia di Mambrui', 'turtle-conservation': 'Visita alla conservazione delle tartarughe marine'
  },
  fr: {
    'safari-blu-mida': 'Safari Bleu — Mida Creek', 'safari-blu-sardegna': 'Safari Bleu — Île Sardegna 2', 'isola-amore': "Île de l'Amour", 'robinson-golden': 'Île Robinson & Golden Beach', 'mangrovie-canoa': 'Canoë dans les mangroves — Mida Creek', 'gede-ruins': 'Ruines de Gede', 'marafa-kitchen': "Hell's Kitchen de Marafa", 'malindi-town': 'Visite de la ville de Malindi', 'dabaso-village': "L'Afrique authentique — village de Dabaso", 'dolphin-turtle-swim': 'Nage avec les dauphins et les tortues', 'deep-sea-fishing': 'Pêche au gros en haute mer', 'arabuko-sokoke-forest': "Promenade dans la forêt d'Arabuko-Sokoke", 'kitesurfing-lesson': 'Cours de kitesurf', 'sunset-dhow-cruise': 'Croisière en dhow au coucher du soleil', 'falconry-of-kenya': 'Fauconnerie du Kenya', 'mambrui-sand-dunes': 'Dunes de sable de Mambrui', 'turtle-conservation': 'Visite de conservation des tortues marines'
  },
  es: {
    'safari-blu-mida': 'Safari Azul — Mida Creek', 'safari-blu-sardegna': 'Safari Azul — Isla Sardegna 2', 'isola-amore': 'Isla del Amor', 'robinson-golden': 'Isla Robinson y Golden Beach', 'mangrovie-canoa': 'Canoa por los manglares — Mida Creek', 'gede-ruins': 'Ruinas de Gede', 'marafa-kitchen': "Hell's Kitchen de Marafa", 'malindi-town': 'Visita de la ciudad de Malindi', 'dabaso-village': 'África auténtica — Aldea de Dabaso', 'dolphin-turtle-swim': 'Nado con delfines y tortugas', 'deep-sea-fishing': 'Pesca en alta mar', 'arabuko-sokoke-forest': 'Paseo por el bosque Arabuko-Sokoke', 'kitesurfing-lesson': 'Clase de kitesurf', 'sunset-dhow-cruise': 'Crucero en dhow al atardecer', 'falconry-of-kenya': 'Cetrería de Kenia', 'mambrui-sand-dunes': 'Dunas de arena de Mambrui', 'turtle-conservation': 'Visita de conservación de tortugas marinas'
  },
  de: {
    'safari-blu-mida': 'Blue Safari — Mida Creek', 'safari-blu-sardegna': 'Blue Safari — Sardegna 2 Insel', 'isola-amore': 'Liebesinsel', 'robinson-golden': 'Robinson Island & Golden Beach', 'mangrovie-canoa': 'Mangroven-Kanutour — Mida Creek', 'gede-ruins': 'Ruinen von Gede', 'marafa-kitchen': "Marafas Hell's Kitchen", 'malindi-town': 'Stadtrundfahrt durch Malindi', 'dabaso-village': 'Authentisches Afrika — Dorf Dabaso', 'dolphin-turtle-swim': 'Schwimmen mit Delfinen und Meeresschildkröten', 'deep-sea-fishing': 'Hochseefischen', 'arabuko-sokoke-forest': 'Wanderung im Arabuko-Sokoke-Wald', 'kitesurfing-lesson': 'Kitesurfing-Kurs', 'sunset-dhow-cruise': 'Dhow-Sunset-Kreuzfahrt', 'falconry-of-kenya': 'Falknerei in Kenia', 'mambrui-sand-dunes': 'Sanddünen von Mambrui', 'turtle-conservation': 'Besuch der Meeresschildkröten-Rettung'
  },
  ar: {
    'safari-blu-mida': 'رحلة السفاري البحرية — خور ميدا', 'safari-blu-sardegna': 'السفاري البحرية — جزيرة سردينيا 2', 'isola-amore': 'جزيرة الحب', 'robinson-golden': 'جزيرة روبنسون والشاطئ الذهبي', 'mangrovie-canoa': 'التجديف بين أشجار المانغروف — خور ميدا', 'gede-ruins': 'آثار غيدي', 'marafa-kitchen': 'مطبخ مارافا الجهنمي', 'malindi-town': 'جولة في مدينة ماليندي', 'dabaso-village': 'أفريقيا الحقيقية — قرية داباسو', 'dolphin-turtle-swim': 'السباحة مع الدلافين والسلاحف', 'deep-sea-fishing': 'صيد الأسماك في أعالي البحار', 'arabuko-sokoke-forest': 'نزهة في غابة أرابوكو-سوكوكي', 'kitesurfing-lesson': 'درس في ركوب الأمواج بالطائرة الورقية', 'sunset-dhow-cruise': 'رحلة دهّو عند غروب الشمس', 'falconry-of-kenya': 'الصقارة في كينيا', 'mambrui-sand-dunes': 'كثبان مامبروي الرملية', 'turtle-conservation': 'زيارة الحفاظ على السلاحف البحرية'
  },
  zh: {
    'safari-blu-mida': '蓝色海上之旅 — 米达溪', 'safari-blu-sardegna': '蓝色海上之旅 — 撒丁岛2号', 'isola-amore': '爱情岛', 'robinson-golden': '罗宾逊岛与黄金海滩', 'mangrovie-canoa': '红树林独木舟 — 米达溪', 'gede-ruins': '盖德遗址', 'marafa-kitchen': '马拉法地狱厨房', 'malindi-town': '马林迪城市之旅', 'dabaso-village': '真实非洲 — 达巴索村', 'dolphin-turtle-swim': '海豚与海龟游泳之旅', 'deep-sea-fishing': '深海垂钓', 'arabuko-sokoke-forest': '阿拉布科-索科克森林徒步', 'kitesurfing-lesson': '风筝冲浪课程', 'sunset-dhow-cruise': '日落独桅帆船之旅', 'falconry-of-kenya': '肯尼亚猎鹰体验', 'mambrui-sand-dunes': '曼布鲁伊沙丘', 'turtle-conservation': '海龟保护中心参观'
  },
  sw: {
    'safari-blu-mida': 'Safari ya Bahari — Mida Creek', 'safari-blu-sardegna': 'Safari ya Bahari — Kisiwa cha Sardegna 2', 'isola-amore': 'Kisiwa cha Mapenzi', 'robinson-golden': 'Kisiwa cha Robinson na Golden Beach', 'mangrovie-canoa': 'Mtumbwi wa Mikoko — Mida Creek', 'gede-ruins': 'Magofu ya Gede', 'marafa-kitchen': "Hell's Kitchen ya Marafa", 'malindi-town': 'Ziara ya Mji wa Malindi', 'dabaso-village': 'Afrika Halisi — Kijiji cha Dabaso', 'dolphin-turtle-swim': 'Kuogelea na Pomboo na Kasa', 'deep-sea-fishing': 'Uvuvi wa Bahari Kuu', 'arabuko-sokoke-forest': 'Matembezi ya Msitu wa Arabuko-Sokoke', 'kitesurfing-lesson': 'Somo la Kitesurfing', 'sunset-dhow-cruise': 'Safari ya Dhow ya Machweo', 'falconry-of-kenya': 'Ufugaji na Uzoefu wa Tai wa Kenya', 'mambrui-sand-dunes': 'Matuta ya Mchanga ya Mambrui', 'turtle-conservation': 'Ziara ya Uhifadhi wa Kasa wa Baharini'
  }
};

const copy: Record<Exclude<SupportedLocale, 'en'>, {
  descriptions: Record<Excursion['category'], string>;
  highlights: Record<Excursion['category'], string[]>;
  expect: string[];
  included: string[];
  notIncluded: string[];
  goodToKnow: string[];
  location: string;
  duration: Record<string, string>;
}> = {
  it: { descriptions: { marine: 'Un’esperienza costiera curata da guide locali, tra acque dell’Oceano Indiano, natura marina e momenti di autentico relax.', nature: 'Un’esperienza nella natura della costa kenyana, accompagnata da guide locali e pensata per osservare fauna e paesaggi con calma.', culture: 'Un incontro autentico con la storia e le comunità della costa kenyana, con racconti locali e tempo per esplorare.' }, highlights: { marine: ['Natura marina', 'Guida locale', 'Paesaggi dell’Oceano Indiano', 'Esperienza adatta ai viaggiatori'], nature: ['Natura e fauna', 'Guida locale', 'Paesaggi costieri', 'Fotografia'], culture: ['Storia locale', 'Cultura swahili', 'Guida locale', 'Incontro con la comunità'] }, expect: ['Trasferimento e briefing con la guida locale.', 'Tempo dedicato all’esperienza principale e all’osservazione.', 'Ritmo rilassato con attenzione alla sicurezza e alla conservazione.'], included: ['Guida locale', 'Attività principale', 'Supporto durante l’esperienza'], notIncluded: ['Pasti e bevande non indicati', 'Spese personali', 'Mance'], goodToKnow: ['Gli avvistamenti e le condizioni naturali dipendono dalla stagione e non possono essere garantiti.'], location: 'Ritiro dal vostro hotel a Watamu', duration: { 'Half Day': 'Mezza giornata', 'Full Day': 'Giornata intera', '3 Hours': '3 ore', '2 Hours': '2 ore' } },
  fr: { descriptions: { marine: 'Une expérience côtière accompagnée par des guides locaux, entre les eaux de l’océan Indien, la vie marine et des moments de détente.', nature: 'Une immersion dans la nature de la côte kenyane avec des guides locaux, idéale pour observer la faune et les paysages à un rythme agréable.', culture: 'Une rencontre authentique avec l’histoire et les communautés de la côte kenyane, enrichie par les récits des habitants.' }, highlights: { marine: ['Vie marine', 'Guide local', 'Paysages de l’océan Indien', 'Expérience pour voyageurs'], nature: ['Nature et faune', 'Guide local', 'Paysages côtiers', 'Photographie'], culture: ['Histoire locale', 'Culture swahilie', 'Guide local', 'Rencontre communautaire'] }, expect: ['Accueil et briefing avec le guide local.', 'Temps consacré à l’activité principale et à l’observation.', 'Rythme détendu avec une attention à la sécurité et à la conservation.'], included: ['Guide local', 'Activité principale', 'Assistance pendant l’expérience'], notIncluded: ['Repas et boissons non mentionnés', 'Dépenses personnelles', 'Pourboires'], goodToKnow: ['Les observations et les conditions naturelles dépendent de la saison et ne sont pas garanties.'], location: 'Prise en charge à votre hôtel à Watamu', duration: { 'Half Day': 'Demi-journée', 'Full Day': 'Journée complète', '3 Hours': '3 heures', '2 Hours': '2 heures' } },
  es: { descriptions: { marine: 'Una experiencia costera acompañada por guías locales, entre las aguas del océano Índico, la vida marina y momentos de relax.', nature: 'Una experiencia en la naturaleza de la costa keniana con guías locales, ideal para observar fauna y paisajes con tranquilidad.', culture: 'Un encuentro auténtico con la historia y las comunidades de la costa keniana, acompañado de relatos locales.' }, highlights: { marine: ['Vida marina', 'Guía local', 'Paisajes del océano Índico', 'Experiencia para viajeros'], nature: ['Naturaleza y fauna', 'Guía local', 'Paisajes costeros', 'Fotografía'], culture: ['Historia local', 'Cultura swahili', 'Guía local', 'Encuentro comunitario'] }, expect: ['Recepción y explicación con el guía local.', 'Tiempo para la actividad principal y la observación.', 'Ritmo tranquilo con atención a la seguridad y la conservación.'], included: ['Guía local', 'Actividad principal', 'Asistencia durante la experiencia'], notIncluded: ['Comidas y bebidas no indicadas', 'Gastos personales', 'Propinas'], goodToKnow: ['Los avistamientos y las condiciones naturales dependen de la temporada y no están garantizados.'], location: 'Recogida en su hotel de Watamu', duration: { 'Half Day': 'Medio día', 'Full Day': 'Día completo', '3 Hours': '3 horas', '2 Hours': '2 horas' } },
  de: { descriptions: { marine: 'Ein Küstenerlebnis mit lokalen Guides, zwischen den Gewässern des Indischen Ozeans, Meeresleben und entspannten Momenten.', nature: 'Ein Naturerlebnis an Kenias Küste mit lokalen Guides, ideal zur ruhigen Beobachtung von Wildtieren und Landschaften.', culture: 'Eine authentische Begegnung mit Geschichte und Gemeinschaften der kenianischen Küste, begleitet von lokalen Geschichten.' }, highlights: { marine: ['Meereswelt', 'Lokaler Guide', 'Landschaften des Indischen Ozeans', 'Reiseerlebnis'], nature: ['Natur und Tierwelt', 'Lokaler Guide', 'Küstenlandschaften', 'Fotografie'], culture: ['Lokale Geschichte', 'Swahili-Kultur', 'Lokaler Guide', 'Gemeinschaftserlebnis'] }, expect: ['Begrüßung und Einweisung durch den lokalen Guide.', 'Zeit für die Hauptaktivität und Beobachtungen.', 'Entspanntes Tempo mit Fokus auf Sicherheit und Naturschutz.'], included: ['Lokaler Guide', 'Hauptaktivität', 'Betreuung während des Erlebnisses'], notIncluded: ['Nicht genannte Mahlzeiten und Getränke', 'Persönliche Ausgaben', 'Trinkgelder'], goodToKnow: ['Sichtungen und natürliche Bedingungen hängen von der Saison ab und können nicht garantiert werden.'], location: 'Abholung von Ihrem Hotel in Watamu', duration: { 'Half Day': 'Halber Tag', 'Full Day': 'Ganzer Tag', '3 Hours': '3 Stunden', '2 Hours': '2 Stunden' } },
  ar: { descriptions: { marine: 'تجربة ساحلية برفقة مرشدين محليين بين مياه المحيط الهندي والحياة البحرية وأوقات الاسترخاء.', nature: 'تجربة في طبيعة الساحل الكيني مع مرشدين محليين لمشاهدة الحياة البرية والمناظر الطبيعية بهدوء.', culture: 'تجربة أصيلة للتعرف على تاريخ ومجتمعات الساحل الكيني من خلال القصص المحلية.' }, highlights: { marine: ['الحياة البحرية', 'مرشد محلي', 'مناظر المحيط الهندي', 'تجربة مناسبة للمسافرين'], nature: ['الطبيعة والحياة البرية', 'مرشد محلي', 'مناظر ساحلية', 'التصوير'], culture: ['التاريخ المحلي', 'الثقافة السواحيلية', 'مرشد محلي', 'تجربة مجتمعية'] }, expect: ['استقبال وشرح من المرشد المحلي.', 'وقت مخصص للنشاط الرئيسي والمشاهدة.', 'وتيرة مريحة مع الاهتمام بالسلامة والحفاظ على الطبيعة.'], included: ['مرشد محلي', 'النشاط الرئيسي', 'الدعم أثناء التجربة'], notIncluded: ['الوجبات والمشروبات غير المذكورة', 'المصاريف الشخصية', 'الإكراميات'], goodToKnow: ['تعتمد المشاهدات والظروف الطبيعية على الموسم ولا يمكن ضمانها.'], location: 'الاستقبال من فندقك في واتامو', duration: { 'Half Day': 'نصف يوم', 'Full Day': 'يوم كامل', '3 Hours': '3 ساعات', '2 Hours': 'ساعتان' } },
  zh: { descriptions: { marine: '在当地向导陪同下探索肯尼亚海岸，体验印度洋海水、海洋生态与轻松时光。', nature: '跟随当地向导深入肯尼亚海岸自然环境，悠闲观察野生动物与壮丽景观。', culture: '通过当地故事了解肯尼亚海岸的历史与社区，体验真实的斯瓦希里文化。' }, highlights: { marine: ['海洋生态', '当地向导', '印度洋景观', '轻松旅行体验'], nature: ['自然与野生动物', '当地向导', '海岸景观', '摄影'], culture: ['当地历史', '斯瓦希里文化', '当地向导', '社区体验'] }, expect: ['当地向导接待并进行行程说明。', '充足时间体验主要活动并进行观察。', '轻松节奏，重视安全与自然保护。'], included: ['当地向导', '主要活动', '体验期间的协助'], notIncluded: ['未注明的餐饮', '个人消费', '小费'], goodToKnow: ['野生动物观察及自然条件受季节影响，无法保证。'], location: '从您在瓦塔穆的酒店接送', duration: { 'Half Day': '半天', 'Full Day': '全天', '3 Hours': '3小时', '2 Hours': '2小时' } },
  sw: { descriptions: { marine: 'Uzoefu wa pwani ukiambatana na waongozaji wa eneo, ukichanganya Bahari ya Hindi, maisha ya baharini na mapumziko.', nature: 'Uzoefu wa asili katika pwani ya Kenya ukiwa na waongozaji wa eneo kwa kutazama wanyamapori na mandhari kwa utulivu.', culture: 'Mkutano halisi na historia na jamii za pwani ya Kenya kupitia simulizi za wenyeji.' }, highlights: { marine: ['Maisha ya baharini', 'Mwongoza wa eneo', 'Mandhari ya Bahari ya Hindi', 'Uzoefu wa msafiri'], nature: ['Asili na wanyamapori', 'Mwongoza wa eneo', 'Mandhari ya pwani', 'Upigaji picha'], culture: ['Historia ya eneo', 'Utamaduni wa Kiswahili', 'Mwongoza wa eneo', 'Uzoefu wa jamii'] }, expect: ['Mapokezi na maelekezo kutoka kwa mwongoza wa eneo.', 'Muda wa kutosha kwa shughuli kuu na kutazama mazingira.', 'Mwendo wa utulivu unaozingatia usalama na uhifadhi wa mazingira.'], included: ['Mwongoza wa eneo', 'Shughuli kuu', 'Msaada wakati wa uzoefu'], notIncluded: ['Chakula na vinywaji visivyoainishwa', 'Matumizi binafsi', 'Bakshishi'], goodToKnow: ['Mionekano na hali za asili hutegemea msimu na haziwezi kuhakikishwa.'], location: 'Usafiri wa kuchukua kutoka hoteli yako Watamu', duration: { 'Half Day': 'Nusu siku', 'Full Day': 'Siku nzima', '3 Hours': 'Saa 3', '2 Hours': 'Saa 2' } }
};

export function getLocalizedExcursion(excursion: Excursion, locale: SupportedLocale): LocalizedExcursion {
  if (locale === 'en') {
    return {
      name: excursion.name,
      description: excursion.description,
      duration: excursion.duration,
      startingLocation: excursion.startingLocation ?? '',
      highlights: excursion.highlights,
      whatToExpect: excursion.whatToExpect ?? [],
      included: excursion.included ?? [],
      notIncluded: excursion.notIncluded ?? [],
      goodToKnow: excursion.goodToKnow ?? []
    };
  }
  const c = copy[locale];
  return {
    name: names[locale][excursion.id] ?? excursion.name,
    description: c.descriptions[excursion.category],
    duration: c.duration[excursion.duration] ?? excursion.duration,
    startingLocation: c.location,
    highlights: c.highlights[excursion.category],
    whatToExpect: c.expect,
    included: c.included,
    notIncluded: c.notIncluded,
    goodToKnow: c.goodToKnow
  };
}
