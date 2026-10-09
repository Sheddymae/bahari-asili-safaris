"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Stop } from "@/lib/kenya-safari-locations";

type Props = {
  stops: Stop[];
  safariTitle: string;
  activeDay: number | null;
  onSelectDay: (day: number | null) => void;
};

declare global {
  interface Window {
    L?: any;
  }
}

const BRAND = "#0E7482";
const ROUTE_URL = "https://router.project-osrm.org/route/v1/driving";
const LEAFLET_VERSION = "1.9.4";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] || char,
  );
}

function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Map can only load in a browser."));
      return;
    }

    const existingCss = document.querySelector<HTMLLinkElement>("link[data-bahari-leaflet]");
    if (!existingCss) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
      css.dataset.bahariLeaflet = "true";
      document.head.appendChild(css);
    }

    if (window.L) {
      resolve(window.L);
      return;
    }

    let script = document.querySelector<HTMLScriptElement>("script[data-bahari-leaflet]");
    if (script) {
      script.addEventListener("load", () => window.L ? resolve(window.L) : reject(new Error("Leaflet did not initialise.")), { once: true });
      script.addEventListener("error", () => reject(new Error("Leaflet script failed to load.")), { once: true });
      return;
    }

    script = document.createElement("script");
    script.src = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
    script.async = true;
    script.dataset.bahariLeaflet = "true";
    script.onload = () => window.L ? resolve(window.L) : reject(new Error("Leaflet did not initialise."));
    script.onerror = () => reject(new Error("Leaflet script failed to load."));
    document.body.appendChild(script);
  });
}

export default function SafariRouteMap({ stops, safariTitle, activeDay, onSelectDay }: Props) {
  const element = useRef<HTMLDivElement | null>(null);
  const map = useRef<any>(null);
  const markers = useRef<Record<number, any>>({});
  const route = useRef<any>(null);
  const routeRequest = useRef<AbortController | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [basemapError, setBasemapError] = useState(false);
  const [routingStatus, setRoutingStatus] = useState<"loading" | "road" | "fallback">("loading");

  // Depend on actual route data, not the parent array identity. This prevents
  // React renders from destroying the map and leaving only the numbered pins.
  const stopsKey = useMemo(
    () => JSON.stringify(stops.map((stop) => ({
      day: stop.day,
      title: stop.title,
      location: stop.location,
      coords: stop.coords,
      description: stop.description,
      transferFromPrevious: stop.transferFromPrevious,
    }))),
    [stops],
  );

  useEffect(() => {
    let cancelled = false;
    let mapInstance: any = null;

    async function init() {
      try {
        const L = await loadLeaflet();
        if (cancelled || !element.current) return;

        mapInstance = L.map(element.current, {
          scrollWheelZoom: true,
          zoomControl: true,
          preferCanvas: true,
        }).setView([-0.8, 37.8], 6);
        map.current = mapInstance;

        // Use live street-map tiles with a monitored provider fallback chain.
        // A map is not considered visually loaded until actual tiles arrive.
        // Start with Esri's direct XYZ-style tile endpoint for quick initial
        // street-map rendering, then fall back to CARTO and OpenStreetMap.
        // Keep the initial request lightweight; Leaflet loads only visible tiles.
        const tileProviders = [
          {
            name: "Esri World Street Map",
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            options: {
              attribution: "Tiles &copy; Esri — Sources: Esri, HERE, Garmin, OpenStreetMap contributors, and the GIS user community",
              maxZoom: 19,
              minZoom: 2,
              updateWhenIdle: true,
              updateWhenZooming: false,
              keepBuffer: 1,
              detectRetina: false,
              crossOrigin: true,
            },
          },
          {
            name: "CARTO",
            url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            options: {
              subdomains: "abcd",
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
              maxZoom: 20,
              minZoom: 2,
              updateWhenIdle: true,
              updateWhenZooming: false,
              keepBuffer: 1,
              detectRetina: false,
              crossOrigin: true,
            },
          },
          {
            name: "OpenStreetMap",
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
              maxZoom: 19,
              minZoom: 2,
              updateWhenIdle: true,
              updateWhenZooming: false,
              keepBuffer: 1,
              detectRetina: false,
              crossOrigin: true,
            },
          },
        ];
        let providerIndex = -1;
        let activeTileLayer: any = null;
        let tileFallbackTimer: number | null = null;
        let tileLoadCount = 0;

        const clearTileFallbackTimer = () => {
          if (tileFallbackTimer !== null) {
            window.clearTimeout(tileFallbackTimer);
            tileFallbackTimer = null;
          }
        };

        const useNextTileProvider = () => {
          if (cancelled || !mapInstance) return;
          clearTileFallbackTimer();
          if (activeTileLayer && mapInstance.hasLayer(activeTileLayer)) {
            mapInstance.removeLayer(activeTileLayer);
          }
          providerIndex += 1;
          if (providerIndex >= tileProviders.length) {
            setBasemapError(true);
            return;
          }

          tileLoadCount = 0;
          const provider = tileProviders[providerIndex];
          const layer = L.tileLayer(provider.url, provider.options).addTo(mapInstance);
          activeTileLayer = layer;

          layer.on("tileload", () => {
            tileLoadCount += 1;
            setBasemapError(false);
            clearTileFallbackTimer();
          });

          layer.on("tileerror", () => {
            if (cancelled || layer !== activeTileLayer) return;
            // Switch providers after several failed requests, not on one missing tile.
            const failedTiles = Number(layer._bahariTileErrors || 0) + 1;
            layer._bahariTileErrors = failedTiles;
            if (failedTiles >= 4 && tileLoadCount === 0) useNextTileProvider();
          });

          // Some blocked endpoints never reliably emit enough tileerror events.
          tileFallbackTimer = window.setTimeout(() => {
            if (!cancelled && layer === activeTileLayer && tileLoadCount === 0) {
              useNextTileProvider();
            }
          }, 5000);
        };

        useNextTileProvider();

        // The site-wide img { max-width: 100% } rule was resizing Leaflet's
        // fixed 256px map tiles. The scoped override below restores tile size.
        const points: [number, number][] = [];
        for (const stop of stops) {
          if (!Array.isArray(stop.coords) || stop.coords.length !== 2 || !stop.coords.every(Number.isFinite)) continue;
          points.push(stop.coords);

          const icon = L.divIcon({
            className: "bahari-route-pin-wrap",
            html: `<span class="bahari-route-pin" data-day="${stop.day}">${stop.day}</span>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
          const marker = L.marker(stop.coords, { icon, keyboard: true })
            .addTo(mapInstance)
            .bindPopup(
              `<div class="bahari-route-popup"><strong>Day ${stop.day}: ${escapeHtml(stop.title)}</strong><br/><span>${escapeHtml(stop.location)}</span><br/><button type="button" data-select-day="${stop.day}" class="bahari-route-popup-button">View this day</button></div>`,
            );

          marker.on("click", () => onSelectDay(stop.day));
          markers.current[stop.day] = marker;
        }

        const validStops = stops.filter((stop) =>
          Array.isArray(stop.coords) && stop.coords.length === 2 && stop.coords.every(Number.isFinite),
        );

        // First render a reliable itinerary line immediately. Replace it with
        // road-following geometry when the routing service responds.
        if (points.length > 1) {
          route.current = L.polyline(points, {
            color: BRAND,
            weight: 4,
            opacity: 0.72,
            dashArray: "7 7",
          }).addTo(mapInstance);
          mapInstance.fitBounds(route.current.getBounds(), { padding: [36, 36], maxZoom: 7 });
        } else if (points.length === 1) {
          mapInstance.setView(points[0], 9);
        }

        mapInstance.on("popupopen", (event: any) => {
          const node = event.popup.getElement()?.querySelector("[data-select-day]") as HTMLButtonElement | null | undefined;
          if (!node) return;
          node.onclick = () => onSelectDay(Number(node.dataset.selectDay));
        });

        setReady(true);
        setError(false);
        window.setTimeout(() => {
          if (!cancelled && mapInstance) mapInstance.invalidateSize({ pan: false });
        }, 150);

        if (validStops.length > 1) {
          const controller = new AbortController();
          routeRequest.current = controller;
          setRoutingStatus("loading");
          try {
            const coordinates = validStops
              .map((stop) => `${stop.coords[1]},${stop.coords[0]}`)
              .join(";");
            const response = await fetch(
              `${ROUTE_URL}/${coordinates}?overview=full&geometries=geojson&steps=false&alternatives=false`,
              { signal: controller.signal },
            );
            if (!response.ok) throw new Error("Road routing request failed.");
            const result = await response.json();
            const geometry = result?.routes?.[0]?.geometry?.coordinates;
            if (!Array.isArray(geometry) || geometry.length < 2) throw new Error("No road route returned.");
            if (cancelled || !mapInstance) return;

            const roadPoints: [number, number][] = geometry.map(
              (point: [number, number]) => [point[1], point[0]],
            );
            if (route.current) mapInstance.removeLayer(route.current);
            route.current = L.polyline(roadPoints, {
              color: BRAND,
              weight: 5,
              opacity: 0.92,
              lineJoin: "round",
            }).addTo(mapInstance);
            mapInstance.fitBounds(route.current.getBounds(), { padding: [36, 36], maxZoom: 7 });
            setRoutingStatus("road");
          } catch (routingError) {
            if (routingError instanceof Error && routingError.name === "AbortError") return;
            // Keep the itinerary connected if the public best-effort router is
            // temporarily unavailable; do not leave the map blank.
            if (!cancelled) setRoutingStatus("fallback");
          }
        } else {
          setRoutingStatus("fallback");
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setReady(false);
        }
      }
    }

    // Avoid creating a map without any itinerary coordinates.
    if (stops.length > 0) void init();

    return () => {
      cancelled = true;
      routeRequest.current?.abort();
      routeRequest.current = null;
      mapInstance?.remove();
      if (map.current === mapInstance) map.current = null;
      markers.current = {};
      route.current = null;
    };
    // stopsKey serialises the fields used by the map and avoids reference churn.
    // onSelectDay is a stable useCallback in the parent component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopsKey, safariTitle, onSelectDay]);

  useEffect(() => {
    if (!map.current) return;
    if (activeDay == null) {
      if (route.current) map.current.fitBounds(route.current.getBounds(), { padding: [36, 36], maxZoom: 7 });
      return;
    }
    const marker = markers.current[activeDay];
    if (marker) {
      map.current.flyTo(marker.getLatLng(), 10, { duration: 0.65 });
      marker.openPopup();
    }
  }, [activeDay]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      <style jsx global>{`
        .bahari-route-pin-wrap { background: transparent; border: 0; }
        .bahari-route-pin {
          display: flex; width: 36px; height: 36px; align-items: center; justify-content: center;
          border: 3px solid white; border-radius: 999px; background: ${BRAND}; color: white;
          font: 700 13px ui-sans-serif, system-ui; box-shadow: 0 2px 8px #0003;
        }
        .bahari-route-pin[data-day="${activeDay}"] { background: #FF7A00; transform: scale(1.18); }
        .leaflet-container { width: 100%; height: 100%; background: #e8eee9; font-family: Inter, sans-serif; z-index: 0; }
        .leaflet-container .leaflet-tile,
        .leaflet-container .leaflet-tile-container img { max-width: none !important; max-height: none !important; }
        .leaflet-container img { max-width: none !important; }
        .leaflet-control-attribution { font-size: 10px !important; background: rgba(255,255,255,.88) !important; }
        .bahari-route-popup { line-height: 1.6; min-width: 150px; }
        .bahari-route-popup-button { display: inline-block; margin-top: 7px; color: ${BRAND}; font-weight: 700; cursor: pointer; }
      `}</style>
      <div className="relative">
        <div
          ref={element}
          role="application"
          aria-label={`Interactive route map for ${safariTitle}`}
          className="h-[360px] w-full sm:h-[470px]"
        />
        {!ready && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-sand-50/90 text-sm text-muted-foreground" role="status">
            Loading interactive route map…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-sand-50 p-6 text-center text-sm text-muted-foreground">
            <strong>The interactive map could not start.</strong>
            <span>Check your connection and reload the page.</span>
          </div>
        )}
        {ready && basemapError && (
          <div className="absolute left-3 right-3 top-3 z-[1000] rounded-md border border-amber-300 bg-white/95 px-3 py-2 text-xs text-slate-700 shadow-sm" role="status">
            Live map tiles are blocked or unavailable on this connection. Try reloading or checking browser extensions/network restrictions.
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span>● Numbered pins are itinerary days</span>
        <span>
          {routingStatus === "road" ? "Road route © OSRM" : routingStatus === "loading" ? "Calculating road route…" : "Direct itinerary line"}
          {" · "}Zoom in for destination streets and place names
        </span>
      </div>
    </div>
  );
}
