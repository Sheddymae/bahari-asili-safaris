export const WHATSAPP_NUMBER = '254101923355';
export const PHONE_TEL = '+254101923355';
export const PHONE_DISPLAY = '+254 101 923 355';
export const BUSINESS_EMAIL = 'bahariasilisafaris@gmail.com';

export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
