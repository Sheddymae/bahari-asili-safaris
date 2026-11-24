export interface ContentCompleteness {
  complete: boolean;
  missing: string[];
}

type Candidate = {
  id?: string;
  name?: string;
  days?: number;
  nights?: number;
  parks?: string[];
  itinerary?: unknown[];
  driveHoursPerDay?: number[];
  included?: string[];
  excluded?: string[];
  bestMonths?: string[];
  familyNotes?: string;
  olderTravellerNotes?: string;
  packingTips?: string[];
  faqs?: { q?: string; a?: string }[];
  lastReviewedAt?: string;
  image?: string;
  duration?: string;
  description?: string;
  startingLocation?: string;
  meetingPoint?: string;
  minimumAge?: number;
  groupSize?: string;
  vehicleCapacity?: number;
  cancellationPolicy?: string;
  packingText?: string;
  whatToExpect?: string[];
  highlights?: string[];
};

export function contentComplete(program: Candidate, kind: 'safari' | 'excursion' = 'safari'): ContentCompleteness {
  const missing: string[] = [];
  const validReviewDate = typeof program.lastReviewedAt === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(program.lastReviewedAt) && !Number.isNaN(Date.parse(program.lastReviewedAt));
  if (!validReviewDate) missing.push('lastReviewedAt');
  if (!program.image) missing.push('real product image');

  if (kind === 'safari') {
    if (!program.itinerary?.length) missing.push('verified itinerary');
    if (!program.driveHoursPerDay || program.driveHoursPerDay.length !== program.itinerary?.length || program.driveHoursPerDay.some((hours) => !Number.isFinite(hours) || hours <= 0)) missing.push('driveHoursPerDay for every itinerary day');
    if (!program.included?.length) missing.push('program-specific inclusions');
    if (!program.excluded?.length) missing.push('program-specific exclusions');
    if (!program.bestMonths?.length) missing.push('owner-verified bestMonths');
    if (!program.familyNotes?.trim()) missing.push('familyNotes');
    if (!program.olderTravellerNotes?.trim()) missing.push('olderTravellerNotes');
    if (!program.packingTips?.length) missing.push('packingTips');
    if (!program.faqs || program.faqs.length < 5 || program.faqs.some((faq) => !faq.q?.trim() || !faq.a?.trim())) missing.push('5–6 distinct FAQs');
  } else {
    if (!program.duration?.trim()) missing.push('verified duration');
    if (!program.description?.trim()) missing.push('unique description');
    if (!(program.meetingPoint || program.startingLocation)) missing.push('verified meetingPoint');
    if (program.minimumAge === undefined) missing.push('minimumAge or explicit ask-us policy');
    if (!program.groupSize) missing.push('groupSize');
    if (!program.vehicleCapacity) missing.push('vehicleCapacity');
    if (!program.cancellationPolicy) missing.push('cancellationPolicy');
    if (!program.included?.length) missing.push('inclusions');
    if (!program.excluded?.length) missing.push('exclusions');
    if (!program.packingText && !program.whatToExpect?.length) missing.push('packing / what-to-expect details');
    if (!program.highlights?.length) missing.push('verified highlights');
    if (!program.faqs || program.faqs.length < 5 || program.faqs.some((faq) => !faq.q?.trim() || !faq.a?.trim())) missing.push('5–6 distinct FAQs');
  }

  return { complete: missing.length === 0, missing };
}
