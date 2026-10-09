export type LatLngTuple = [number, number];
export type Stop = { day:number; title:string; location:string; coords:LatLngTuple; description?:string; image?:string; transferFromPrevious?:"road"|"fly" };
const LOCATIONS:Record<string,{name:string;coords:LatLngTuple;aliases?:string[]}> = {
 nairobi:{name:"Nairobi",coords:[-1.2921,36.8219],aliases:["jkia","jomo kenyatta"]},
 "masai-mara":{name:"Masai Mara",coords:[-1.4443,35.1417],aliases:["maasai mara","mara","masai mara national reserve"]},
 amboseli:{name:"Amboseli",coords:[-2.6527,37.2608],aliases:["amboseli national park"]},
 "tsavo-east":{name:"Tsavo East",coords:[-2.9908,38.4697],aliases:["tsavo east national park","tsavo"]},
 "tsavo-west":{name:"Tsavo West",coords:[-3,38],aliases:["tsavo west national park"]},
 "lake-nakuru":{name:"Lake Nakuru",coords:[-0.3031,36.08],aliases:["nakuru"]},
 "lake-naivasha":{name:"Lake Naivasha",coords:[-0.7167,36.4333],aliases:["naivasha"]},
 samburu:{name:"Samburu",coords:[0.6,37.55],aliases:["samburu national reserve"]},
 laikipia:{name:"Laikipia",coords:[0.3,36.9],aliases:["ol pejeta","nanyuki"]},
 mombasa:{name:"Mombasa",coords:[-4.0435,39.6682],aliases:["moi international airport"]},
 watamu:{name:"Watamu",coords:[-3.3547,40.0238]}, malindi:{name:"Malindi",coords:[-3.2192,40.1169]},
 diani:{name:"Diani",coords:[-4.2797,39.5978],aliases:["diani beach","ukunda"]}, lamu:{name:"Lamu",coords:[-2.2717,40.902]},
 "shimba-hills":{name:"Shimba Hills",coords:[-4.2333,39.4167]}
};
const norm=(s:string)=>s.toLowerCase().replace(/['’]/g,"").replace(/[^a-z0-9]+/g," ").trim();
const index=Object.entries(LOCATIONS).flatMap(([key,e])=>[key.replace(/-/g," "),e.name,...(e.aliases??[])].map(term=>({term:norm(term),coords:e.coords,name:e.name}))).sort((a,b)=>b.term.length-a.term.length);
export function getCoords(value?:string|null){if(!value)return null;const q=norm(value);const found=index.find(x=>x.term===q)||index.find(x=>(` ${q} `).includes(` ${x.term} `));return found?{coords:found.coords,name:found.name}:null;}
type RawDay={day?:number|string;title?:string;location?:string;locationKey?:string;coords?:LatLngTuple|{lat:number;lng:number}|null;description?:string;image?:string;transfer?:"road"|"fly"};
export function resolveStops(raw:unknown,fallbackLocations:string[]=[]):Stop[]{if(!Array.isArray(raw))return[];return(raw as RawDay[]).map((d,i)=>{const day=Number(d.day)||i+1,title=String(d.title||`Day ${day}`),where=String(d.location||d.locationKey||fallbackLocations[i]||title),found=getCoords(d.locationKey)||getCoords(where)||getCoords(title);let coords:LatLngTuple|undefined;if(Array.isArray(d.coords)&&d.coords.length>=2)coords=[Number(d.coords[0]),Number(d.coords[1])];else if(d.coords&&typeof d.coords==="object"&&"lat"in d.coords&&"lng"in d.coords)coords=[Number(d.coords.lat),Number(d.coords.lng)];else coords=found?.coords;if(!coords||!coords.every(Number.isFinite))return null;return{day,title,location:found?.name||where,coords,description:d.description,image:d.image,transferFromPrevious:d.transfer==="fly"?"fly":"road"} satisfies Stop;}).filter((s):s is Stop=>Boolean(s)).sort((a,b)=>a.day-b.day);}
