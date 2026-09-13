import { safaris, type Safari } from './tours-data';
import type { Locale } from './i18n';
import { normalizeLocale } from './locale-content';

export type ProgramPayload = Omit<Safari,'id'> & { id?: string; locale?: Locale };

export function safariToRow(s: Safari, locale: Locale='en') {
  return {
    slug:s.id, locale, name:s.name, tagline:s.tagline, days:s.days, nights:s.nights,
    parks:s.parks, lodges:s.lodges, highlights:s.highlights, itinerary:s.itinerary,
    packing_tips:s.packingTips, included:s.included || [], excluded:s.excluded || [],
    image:s.image, category:s.category, rating:s.rating, review_count:s.reviewCount,
    activity_level:s.activityLevel || 3, comfort_level:s.comfortLevel || 4,
  };
}

export function rowToSafari(row:any): Safari {
  return {
    id:String(row.slug), name:String(row.name||row.slug), tagline:String(row.tagline||''),
    days:Number(row.days||1), nights:Number(row.nights||0), parks:Array.isArray(row.parks)?row.parks:[],
    lodges:Array.isArray(row.lodges)?row.lodges:[], tabs:Array.isArray(row.tabs)?row.tabs:[],
    rating:Number(row.rating||0), reviewCount:Number(row.review_count||0), image:String(row.image||''),
    category:(row.category||'short') as Safari['category'], highlights:Array.isArray(row.highlights)?row.highlights:[],
    itinerary:Array.isArray(row.itinerary)?row.itinerary:[], packingTips:Array.isArray(row.packing_tips)?row.packing_tips:[],
    included:Array.isArray(row.included)?row.included:[], excluded:Array.isArray(row.excluded)?row.excluded:[],
    activityLevel:Number(row.activity_level||3), comfortLevel:Number(row.comfort_level||4),
  };
}

export function mergeProgram(base:Safari, row:any): Safari {
  if(!row) return base;
  const merged:any={...base,...row,id:base.id};
  if(row.slug) merged.id=row.slug;
  if(Array.isArray(row.parks)) merged.parks=row.parks;
  if(Array.isArray(row.lodges)) merged.lodges=row.lodges;
  if(Array.isArray(row.highlights)) merged.highlights=row.highlights;
  if(Array.isArray(row.itinerary)) merged.itinerary=row.itinerary;
  if(Array.isArray(row.packing_tips)) merged.packingTips=row.packing_tips;
  if(Array.isArray(row.included)) merged.included=row.included;
  if(Array.isArray(row.excluded)) merged.excluded=row.excluded;
  if(row.review_count!=null) merged.reviewCount=Number(row.review_count);
  if(row.activity_level!=null) merged.activityLevel=Number(row.activity_level);
  if(row.comfort_level!=null) merged.comfortLevel=Number(row.comfort_level);
  return merged as Safari;
}

export function normalizeProgramBody(body:any): ProgramPayload {
  const locale=normalizeLocale(body.locale);
  const id=String(body.id||body.slug||'').trim().toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-|-$/g,'');
  if(!id) throw new Error('Program slug is required.');
  return {
    id, locale, name:String(body.name||'').trim(), tagline:String(body.tagline||'').trim(), days:Math.max(1,Number(body.days||1)), nights:Math.max(0,Number(body.nights||0)),
    parks:Array.isArray(body.parks)?body.parks.map(String):[], lodges:Array.isArray(body.lodges)?body.lodges.map(String):[], tabs:Array.isArray(body.tabs)?body.tabs:[],
    rating:Number(body.rating||0), reviewCount:Number(body.reviewCount||0), image:String(body.image||''), category:body.category||'short', popular:Boolean(body.popular),
    highlights:Array.isArray(body.highlights)?body.highlights.map(String):[], itinerary:Array.isArray(body.itinerary)?body.itinerary:[], packingTips:Array.isArray(body.packingTips)?body.packingTips.map(String):[],
    included:Array.isArray(body.included)?body.included.map(String):[], excluded:Array.isArray(body.excluded)?body.excluded.map(String):[], activityLevel:Number(body.activityLevel||3), comfortLevel:Number(body.comfortLevel||4),
  };
}
