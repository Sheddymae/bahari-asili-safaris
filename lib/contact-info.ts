export const WHATSAPP_NUMBER = '254101923355';
export const PHONE_TEL = '+254101923355';
export const PHONE_DISPLAY = '+254 101 923 355';
export const INFO_EMAIL = 'info@bahariasilisafaris.co.ke';
export const BOOKING_EMAIL = 'booking@bahariasilisafaris.co.ke';
export const HELP_EMAIL = 'help@bahariasilisafaris.co.ke';
export const BUSINESS_EMAIL = INFO_EMAIL;

export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
