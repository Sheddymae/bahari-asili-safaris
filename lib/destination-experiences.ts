export type DestinationActivityKey =
  | 'gameDrive' | 'elephantWatch' | 'predatorTracking' | 'birdwatching' | 'culturalVisit'
  | 'waterholeWatch' | 'rhinoViewing' | 'boatSafari' | 'walkingCycling' | 'forestWalk'
  | 'mountainTrek' | 'migrationViewing' | 'craterDrive' | 'gorillaTrek' | 'riverSafari'
  | 'fallsViewpoint' | 'spiceTour' | 'stoneTown' | 'reefSnorkel' | 'specialFive';

export interface DestinationExperience {
  safariIds: string[];
  activityKeys: DestinationActivityKey[];
}

export const destinationExperiences: Record<string, DestinationExperience> = {
  tsavo: { safariIds: ['experience','2-day-tsavo-west','3-day-tsavo-west-east','4-day-tsavo-east-west','inside','simba-timon','nala','twiga'], activityKeys: ['gameDrive','elephantWatch','waterholeWatch'] },
  amboseli: { safariIds: ['inside','2-day-amboseli','3-day-amboseli','4-day-amboseli-tsavo','simba-timon','twiga'], activityKeys: ['elephantWatch','gameDrive','birdwatching'] },
  mara: { safariIds: ['zazu','4-day-masai-mara','3-day-nakuru-mara','4-day-naivasha-nakuru-mara','5-day-mara-nakuru-amboseli'], activityKeys: ['gameDrive','migrationViewing','culturalVisit'] },
  taita: { safariIds: ['nala','2-day-taita-hills','4-day-taita-tsavo','twiga'], activityKeys: ['gameDrive','waterholeWatch','birdwatching'] },
  samburu: { safariIds: ['3-day-samburu'], activityKeys: ['specialFive','riverSafari','culturalVisit'] },
  'lake-nakuru': { safariIds: ['2-day-lake-nakuru','3-day-nakuru-mara','4-day-naivasha-nakuru-mara','5-day-mara-nakuru-amboseli'], activityKeys: ['rhinoViewing','birdwatching','gameDrive'] },
  'naivasha-hells-gate': { safariIds: ['2-day-naivasha-hellsgate','4-day-naivasha-nakuru-mara'], activityKeys: ['boatSafari','walkingCycling','birdwatching'] },
  'mount-kenya': { safariIds: ['3-day-mount-kenya'], activityKeys: ['forestWalk','mountainTrek','birdwatching'] },
  serengeti: { safariIds: ['4-day-serengeti'], activityKeys: ['gameDrive','migrationViewing','predatorTracking'] },
  ngorongoro: { safariIds: ['3-day-ngorongoro'], activityKeys: ['craterDrive','gameDrive','culturalVisit'] },
  tarangire: { safariIds: ['3-day-tarangire'], activityKeys: ['elephantWatch','gameDrive','birdwatching'] },
  zanzibar: { safariIds: ['4-day-zanzibar'], activityKeys: ['stoneTown','spiceTour','reefSnorkel'] },
  'queen-elizabeth': { safariIds: ['4-day-queen-elizabeth'], activityKeys: ['boatSafari','gameDrive','predatorTracking'] },
  bwindi: { safariIds: ['3-day-bwindi'], activityKeys: ['gorillaTrek','forestWalk','culturalVisit'] },
  'murchison-falls': { safariIds: ['4-day-murchison-falls'], activityKeys: ['riverSafari','fallsViewpoint','gameDrive'] },
  akagera: { safariIds: ['3-day-akagera'], activityKeys: ['gameDrive','boatSafari','birdwatching'] },
};

export function getDestinationExperience(slug: string): DestinationExperience {
  return destinationExperiences[slug] ?? { safariIds: [], activityKeys: [] };
}
