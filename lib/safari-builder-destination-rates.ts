import type { DestinationRate } from '@/lib/quotation-pricing';

/**
 * Baseline planning rates in KES for every public destination.
 * These are starting values only; the Admin > Safari Pricing screen is the
 * authoritative place to change them. Prices are never presented as a
 * guaranteed supplier rate.
 */
export const EXTENDED_DESTINATION_RATES: Record<string, DestinationRate> = {
  tsavo: { accommodationPerNight: 14000, parkFeePerAdultPerDay: 2500, parkFeePerChildPerDay: 1200, guideVehiclePerDay: 9000, mealsPerAdultPerDay: 3000, mealsPerChildPerDay: 1500 },
  amboseli: { accommodationPerNight: 15500, parkFeePerAdultPerDay: 2800, parkFeePerChildPerDay: 1300, guideVehiclePerDay: 9500, mealsPerAdultPerDay: 3200, mealsPerChildPerDay: 1600 },
  mara: { accommodationPerNight: 18000, parkFeePerAdultPerDay: 3500, parkFeePerChildPerDay: 1700, guideVehiclePerDay: 12000, mealsPerAdultPerDay: 3500, mealsPerChildPerDay: 1750 },
  taita: { accommodationPerNight: 12500, parkFeePerAdultPerDay: 2000, parkFeePerChildPerDay: 1000, guideVehiclePerDay: 8000, mealsPerAdultPerDay: 2800, mealsPerChildPerDay: 1400 },
  samburu: { accommodationPerNight: 16500, parkFeePerAdultPerDay: 3000, parkFeePerChildPerDay: 1500, guideVehiclePerDay: 10000, mealsPerAdultPerDay: 3200, mealsPerChildPerDay: 1600 },
  'lake-nakuru': { accommodationPerNight: 15000, parkFeePerAdultPerDay: 2500, parkFeePerChildPerDay: 1250, guideVehiclePerDay: 9000, mealsPerAdultPerDay: 3000, mealsPerChildPerDay: 1500 },
  'naivasha-hells-gate': { accommodationPerNight: 14500, parkFeePerAdultPerDay: 2000, parkFeePerChildPerDay: 1000, guideVehiclePerDay: 8500, mealsPerAdultPerDay: 3000, mealsPerChildPerDay: 1500 },
  'mount-kenya': { accommodationPerNight: 16000, parkFeePerAdultPerDay: 3000, parkFeePerChildPerDay: 1500, guideVehiclePerDay: 9500, mealsPerAdultPerDay: 3200, mealsPerChildPerDay: 1600 },
  serengeti: { accommodationPerNight: 23000, parkFeePerAdultPerDay: 4500, parkFeePerChildPerDay: 2250, guideVehiclePerDay: 14000, mealsPerAdultPerDay: 4000, mealsPerChildPerDay: 2000 },
  ngorongoro: { accommodationPerNight: 24000, parkFeePerAdultPerDay: 5000, parkFeePerChildPerDay: 2500, guideVehiclePerDay: 14500, mealsPerAdultPerDay: 4000, mealsPerChildPerDay: 2000 },
  tarangire: { accommodationPerNight: 19000, parkFeePerAdultPerDay: 4000, parkFeePerChildPerDay: 2000, guideVehiclePerDay: 13000, mealsPerAdultPerDay: 3500, mealsPerChildPerDay: 1750 },
  zanzibar: { accommodationPerNight: 17000, parkFeePerAdultPerDay: 1000, parkFeePerChildPerDay: 500, guideVehiclePerDay: 7000, mealsPerAdultPerDay: 3000, mealsPerChildPerDay: 1500 },
  'queen-elizabeth': { accommodationPerNight: 18000, parkFeePerAdultPerDay: 3000, parkFeePerChildPerDay: 1500, guideVehiclePerDay: 12000, mealsPerAdultPerDay: 3500, mealsPerChildPerDay: 1750 },
  bwindi: { accommodationPerNight: 22000, parkFeePerAdultPerDay: 5000, parkFeePerChildPerDay: 2500, guideVehiclePerDay: 13000, mealsPerAdultPerDay: 4000, mealsPerChildPerDay: 2000 },
  'murchison-falls': { accommodationPerNight: 18000, parkFeePerAdultPerDay: 3000, parkFeePerChildPerDay: 1500, guideVehiclePerDay: 12000, mealsPerAdultPerDay: 3500, mealsPerChildPerDay: 1750 },
  akagera: { accommodationPerNight: 18000, parkFeePerAdultPerDay: 3000, parkFeePerChildPerDay: 1500, guideVehiclePerDay: 11000, mealsPerAdultPerDay: 3500, mealsPerChildPerDay: 1750 },
};
