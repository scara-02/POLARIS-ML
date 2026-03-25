// // import { useEffect, useRef, useState } from 'react';
// // import L from 'leaflet';
// // // @ts-ignore - leaflet.heat lacks official TS types
// // import 'leaflet.heat';
// // import 'leaflet/dist/leaflet.css';
// // import type { MatchResult, ZonePrediction } from '../types/polaris';

// // interface MapState {
// //   map: L.Map;
// //   markersLayer: L.LayerGroup;
// //   heatLayer: any; 
// //   hotspotsLayer: L.LayerGroup;
// // }

// // export default function MapDashboard() {
// //   const mapRef = useRef<MapState | null>(null);
// //   const [activeNodes, setActiveNodes] = useState<number>(0);

// //   useEffect(() => {
// //     if (mapRef.current) return;

// //     const map = L.map('map-container', { zoomControl: false }).setView([13.04, 80.24], 12);

// //     L.control.zoom({ position: 'topright' }).addTo(map);

// //     L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
// //       attribution: '&copy; CARTO',
// //       subdomains: 'abcd',
// //       maxZoom: 19
// //     }).addTo(map);

// //     const heatLayer = (L as any).heatLayer([], {
// //       radius: 25,
// //       blur: 15,
// //       maxZoom: 14
// //     }).addTo(map);

// //     const markersLayer = L.layerGroup().addTo(map);
// //     const hotspotsLayer = L.layerGroup().addTo(map);

// //     mapRef.current = {
// //       map,
// //       markersLayer,
// //       heatLayer,
// //       hotspotsLayer
// //     };

// //     setTimeout(() => {
// //       map.invalidateSize();
// //     }, 0);

// //     const droneIcon = L.divIcon({
// //       html: '🚁',
// //       className: 'custom-div-icon',
// //       iconSize: [24, 24]
// //     });

// //     const fetchSpatialData = async () => {
// //       try {
// //         const res = await fetch('http://localhost:6081/api/v1/nodes/match?lat=13.04&lon=80.24&radius_km=50&class=16&tenant_id=alpha_logistics');
// //         const json: { status: string; data: MatchResult[] } = await res.json();

// //         if (json.status === "success") {
// //           setActiveNodes(json.data.length);

// //           markersLayer.clearLayers();
// //           const heatData: [number, number, number][] = [];

// //           json.data.forEach((node) => {
// //             heatData.push([node.lat, node.lon, 1.0]);

// //             L.marker([node.lat, node.lon], { icon: droneIcon })
// //               .bindPopup(`<strong>${node.node_id}</strong><br>Distance: ${node.distance_km.toFixed(2)} km`)
// //               .addTo(markersLayer);
// //           });

// //           if (heatData.length > 0) {
// //             heatLayer.setLatLngs(heatData);
// //           }
// //         }
// //       } catch (err) {
// //         console.error("Engine fetch failed", err);
// //       }
// //     };

// //     const fetchPredictedZones = async () => {
// //       try {
// //         const res = await fetch('http://localhost:6081/api/v1/zones/predicted');
// //         const json: { status: string; data: ZonePrediction[] } = await res.json();

// //         if (json.status === "success") {
// //           hotspotsLayer.clearLayers();

// //           json.data.forEach((zone) => {
// //             L.circle([zone.Lat, zone.Lon], {
// //               color: '#ef4444',
// //               fillColor: '#ef4444',
// //               fillOpacity: 0.2,
// //               radius: zone.RadiusKm * 1000
// //             })
// //               .bindPopup(`<b>🤖 AI Prediction</b><br>Zone: ${zone.ID}`)
// //               .addTo(hotspotsLayer);
// //           });
// //         }
// //       } catch (err) {
// //         console.error("Failed to fetch ML zones", err);
// //       }
// //     };

// //     const spatialInterval = setInterval(fetchSpatialData, 1000);
// //     const predictionInterval = setInterval(fetchPredictedZones, 10000);

// //     fetchPredictedZones();

// //     return () => {
// //       clearInterval(spatialInterval);
// //       clearInterval(predictionInterval);

// //       map.remove();
// //       mapRef.current = null;
// //     };
// //   }, []);


// //   return (
// //     <div className="relative w-full h-full">
// //       <div className="absolute top-4 left-4 z-[1000] bg-slate-800/90 p-4 rounded-lg border border-slate-700 shadow-lg">
// //         <div className="text-3xl font-bold text-emerald-500">{activeNodes}</div>
// //         <div className="text-xs text-slate-400 uppercase tracking-widest">Active Nodes</div>
// //       </div>
// //       <div id="map-container" className="w-full h-full" />
// //     </div>
// //   );
// // }

// import { useEffect, useRef, useState } from 'react';
// import L from 'leaflet';
// // @ts-ignore
// import 'leaflet.heat';
// import 'leaflet/dist/leaflet.css';
// import type { MatchResult, ZonePrediction } from '../types/polaris';

// interface MapState {
//   map: L.Map;
//   markersLayer: L.LayerGroup;
//   heatLayer: any;
//   hotspotsLayer: L.LayerGroup;
// }

// export default function MapDashboard() {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const mapRef = useRef<MapState | null>(null);
//   const [activeNodes, setActiveNodes] = useState<number>(0);

//   useEffect(() => {
//     // 🚫 Prevent double init + ensure container exists
//     if (!containerRef.current || mapRef.current) return;

//     const map = L.map(containerRef.current, {
//       zoomControl: false
//     }).setView([13.04, 80.24], 12);

//     L.control.zoom({ position: 'topright' }).addTo(map);

//     L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
//       attribution: '&copy; CARTO',
//       subdomains: 'abcd',
//       maxZoom: 19
//     }).addTo(map);

//     const markersLayer = L.layerGroup().addTo(map);
//     const hotspotsLayer = L.layerGroup().addTo(map);

//     mapRef.current = {
//       map,
//       markersLayer,
//       heatLayer: null,
//       hotspotsLayer
//     };

//     // ✅ Initialize heatmap ONLY after map is ready
//     map.whenReady(() => {
//       // 🔥 Wait until container has real size
//       const waitForSize = () => {
//         const size = map.getSize();

//         if (size.x === 0 || size.y === 0) {
//           requestAnimationFrame(waitForSize);
//           return;
//         }

//         // ✅ Now safe to create heatmap
//         const heatLayer = (L as any).heatLayer([], {
//           radius: 25,
//           blur: 15,
//           maxZoom: 14
//         }).addTo(map);

//         if (mapRef.current) {
//           mapRef.current.heatLayer = heatLayer;
//         }

//         map.invalidateSize();
//       };

//       waitForSize();
//     });


//     const droneIcon = L.divIcon({
//       html: '🚁',
//       className: 'custom-div-icon',
//       iconSize: [24, 24]
//     });

//     // 🚀 Fetch nodes
//     const fetchSpatialData = async () => {
//       try {
//         const res = await fetch(
//           'http://localhost:6081/api/v1/nodes/match?lat=13.04&lon=80.24&radius_km=50&class=16&tenant_id=alpha_logistics'
//         );
//         const json: { status: string; data: MatchResult[] } = await res.json();

//         if (json.status === 'success' && mapRef.current) {
//           const { markersLayer, heatLayer } = mapRef.current;

//           setActiveNodes(json.data.length);
//           markersLayer.clearLayers();

//           const heatData: [number, number, number][] = [];

//           json.data.forEach((node) => {
//             heatData.push([node.lat, node.lon, 1.0]);

//             L.marker([node.lat, node.lon], { icon: droneIcon })
//               .bindPopup(
//                 `<strong>${node.node_id}</strong><br>Distance: ${node.distance_km.toFixed(2)} km`
//               )
//               .addTo(markersLayer);
//           });

//           // ✅ Guard heat layer usage
//           if (heatLayer && heatData.length > 0) {
//             heatLayer.setLatLngs(heatData);
//           }
//         }
//       } catch (err) {
//         console.error('Engine fetch failed', err);
//       }
//     };

//     // 🤖 Fetch predicted zones
//     const fetchPredictedZones = async () => {
//       try {
//         const res = await fetch('http://localhost:6081/api/v1/zones/predicted');
//         const json: { status: string; data: ZonePrediction[] } = await res.json();

//         if (json.status === 'success' && mapRef.current) {
//           const { hotspotsLayer } = mapRef.current;

//           hotspotsLayer.clearLayers();

//           json.data.forEach((zone) => {
//             L.circle([zone.Lat, zone.Lon], {
//               color: '#ef4444',
//               fillColor: '#ef4444',
//               fillOpacity: 0.2,
//               radius: zone.RadiusKm * 1000
//             })
//               .bindPopup(`<b>🤖 AI Prediction</b><br>Zone: ${zone.ID}`)
//               .addTo(hotspotsLayer);
//           });
//         }
//       } catch (err) {
//         console.error('Failed to fetch ML zones', err);
//       }
//     };

//     const spatialInterval = setInterval(fetchSpatialData, 1000);
//     const predictionInterval = setInterval(fetchPredictedZones, 10000);

//     fetchPredictedZones();

//     // 🧹 Cleanup (critical)
//     return () => {
//       clearInterval(spatialInterval);
//       clearInterval(predictionInterval);

//       if (mapRef.current) {
//         mapRef.current.map.remove();
//         mapRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <div className="relative w-full h-full">
//       <div className="absolute top-4 left-4 z-[1000] bg-slate-800/90 p-4 rounded-lg border border-slate-700 shadow-lg">
//         <div className="text-3xl font-bold text-emerald-500">{activeNodes}</div>
//         <div className="text-xs text-slate-400 uppercase tracking-widest">
//           Active Nodes
//         </div>
//       </div>

//       {/* ✅ Use ref instead of id */}
//       <div ref={containerRef} className="w-full h-full" />
//     </div>
//   );
// }


// import { useEffect, useRef, useState } from 'react';
// import L from 'leaflet';
// // @ts-ignore
// import 'leaflet.heat';
// import 'leaflet/dist/leaflet.css';
// import type { MatchResult, ZonePrediction } from '../types/polaris';
// import 'leaflet/dist/leaflet.css';
// interface MapState {
//   map: L.Map;
//   markersLayer: L.LayerGroup;
//   heatLayer: any;
//   hotspotsLayer: L.LayerGroup;
// }

// export default function MapDashboard() {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const mapRef = useRef<MapState | null>(null);
//   const [activeNodes, setActiveNodes] = useState(0);
//   const [predictedLayer, setPredictedLayer] = useState<L.HeatLayer | null>(null);
//   const [showPredicted, setShowPredicted] = useState(false);

//   useEffect(() => {
//     if (!containerRef.current || mapRef.current) return;

//     // Initialize Map
//     const map = L.map(containerRef.current, { zoomControl: false }).setView([13.04, 80.24], 12);
//     L.control.zoom({ position: 'topright' }).addTo(map);

//     L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
//         attribution: '&copy; CARTO'
//     }).addTo(map);

//     const markersLayer = L.layerGroup().addTo(map);
//     const hotspotsLayer = L.layerGroup().addTo(map);

//     mapRef.current = {
//       map,
//       markersLayer,
//       heatLayer: null,
//       hotspotsLayer
//     };

//     setTimeout(() => {
//       map.invalidateSize();
//     }, 250);

//     // Fetch Live Drone Data
//     const fetchSpatialData = async () => {
//       try {
//         // FIXED: Restored the full query parameters
//         const res = await fetch(`${import.meta.env.VITE_ENGINE_API}/nodes/match?lat=13.04&lon=80.24&radius_km=50&class=16&tenant_id=alpha_logistics`);
//         const json = await res.json();

//         const data: MatchResult[] = Array.isArray(json.data) ? json.data : [];

//         if (mapRef.current) {
//           const { markersLayer, heatLayer } = mapRef.current;
//           markersLayer.clearLayers();

//           const heatData: [number, number, number][] = [];
//           const droneIcon = L.divIcon({ html: '🚁', className: 'custom-div-icon', iconSize: [24, 24] });

//           data.forEach(node => {
//             heatData.push([node.lat, node.lon, 1]);
//             L.marker([node.lat, node.lon], { icon: droneIcon })
//              .bindPopup(`<strong style="color:#10b981">${node.node_id}</strong><br>Distance: ${node.distance_km.toFixed(2)} km`)
//              .addTo(markersLayer);
//           });

//           if (heatLayer && heatData.length > 0) {
//             heatLayer.setLatLngs(heatData);
//           }

//           setActiveNodes(data.length);
//         }
//       } catch (err) {
//         // Silent fail on dev disconnects
//       }
//     };

//     // Fetch AI Predictions
//     const fetchPredictedZones = async () => {
//       try {
//         // Pointing to the correct Go Engine route we just tested!
//         const res = await fetch(`http://localhost:6081/api/v1/zones/predicted`);
//         const json = await res.json();

//         if (json.status === "success" && mapRef.current) {
//           const { hotspotsLayer } = mapRef.current;
//           hotspotsLayer.clearLayers();

//           console.log("Rebalancing Suggestions:", json.data.rebalance);

//           // Synthetic coordinates around Chennai for the 20 zones
//           const syntheticCoords = [
//              [13.0827, 80.2707], [13.0102, 80.2553], [12.9716, 80.2186], 
//              [13.0475, 80.2089], [12.9915, 80.1925], [13.0500, 80.2000],
//              [13.0600, 80.2100], [13.0700, 80.2200], [13.0800, 80.2300],
//              [13.0900, 80.2400], [13.1000, 80.2500], [13.1100, 80.2600],
//              [13.1200, 80.2700], [13.1300, 80.2800], [13.1400, 80.2900],
//              [13.1500, 80.3000], [13.1600, 80.3100], [13.1700, 80.3200],
//              [13.1800, 80.3300], [13.1900, 80.3400]
//           ];

//           // Draw a glowing circle for every predicted "Hot Zone"
//           json.data.hot_zones.forEach((zoneIndex: number) => {
//             const coord = syntheticCoords[zoneIndex % syntheticCoords.length];
            
//             L.circle(coord as [number, number], {
//               color: '#ef4444',
//               fillColor: '#ef4444',
//               fillOpacity: 0.5,
//               radius: 1200
//             }).bindPopup(`
//               <b>🤖 AI Forecast</b><br>
//               Zone ID: ${zoneIndex}<br>
//               Status: <span style="color:#ef4444; font-weight:bold;">Demand Spike Imminent</span>
//             `).addTo(hotspotsLayer);
//           });
//         }
//       } catch (err) {
//          console.error("Failed to fetch AI predictions", err);
//       }
//     };

//     const i1 = setInterval(fetchSpatialData, 1000);
//     const i2 = setInterval(fetchPredictedZones, 10000);
//     fetchPredictedZones(); // Immediate fetch on load

//     const fetchPredictedHeatmap = async () => {
//       try {
//         const res = await fetch(`http://localhost:6081/api/v1/zones/predicted`); 
//         const json = await res.json();
        
//         if (json.status === "success") {
//             // Must use the same synthetic coordinates mapping!
//             const syntheticCoords = [
//                 [13.0827, 80.2707], [13.0102, 80.2553], [12.9716, 80.2186], 
//                 [13.0475, 80.2089], [12.9915, 80.1925], [13.0500, 80.2000],
//                 [13.0600, 80.2100], [13.0700, 80.2200], [13.0800, 80.2300],
//                 [13.0900, 80.2400], [13.1000, 80.2500], [13.1100, 80.2600],
//                 [13.1200, 80.2700], [13.1300, 80.2800], [13.1400, 80.2900],
//                 [13.1500, 80.3000], [13.1600, 80.3100], [13.1700, 80.3200],
//                 [13.1800, 80.3300], [13.1900, 80.3400]
//              ];

//             // Safely map the hot_zones array to lat/lon points
//             const points: [number, number, number][] = (json.data.hot_zones || []).map((zoneIndex: number) => {
//                 const coord = syntheticCoords[zoneIndex % syntheticCoords.length];
//                 return [coord[0], coord[1], 0.8]; // lat, lon, high intensity (0.8)
//             });

//             if (predictedLayer) {
//               predictedLayer.setLatLngs(points);
//             } else if (mapRef.current?.map) {
//               const layer = (L as any).heatLayer(points, { 
//                 radius: 45, // Made slightly bigger to see it easier
//                 blur: 25, 
//                 gradient: { 0.4: 'blue', 0.6: 'cyan', 0.8: 'yellow', 1.0: 'red' } 
//               });
//               setPredictedLayer(layer);
//             }
//         }
//       } catch (err) {
//         console.error("Heatmap fetch error:", err);
//       }
//     };

//     const i3 = setInterval(fetchPredictedHeatmap, 30000);
//     fetchPredictedHeatmap();

//     return () => {
//       clearInterval(i1);
//       clearInterval(i2);
//       clearInterval(i3); // Don't forget to clear i3!
//       if (mapRef.current) {
//         mapRef.current.map.remove();
//         mapRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (!predictedLayer || !mapRef.current?.map) return;
    
//     if (showPredicted) {
//       predictedLayer.addTo(mapRef.current.map);
//     } else {
//       predictedLayer.remove();
//     }
//   }, [showPredicted, predictedLayer]);
  

//   return (
//     // FIX: Changed h-full to a fixed viewport height (h-[85vh]) with a minimum fallback!
//     <div className="w-full h-[85vh] min-h-[600px] relative rounded-xl overflow-hidden shadow-2xl border border-slate-700">
//       <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3">
        
//         <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-600 shadow-lg backdrop-blur-sm">
//           <div className="text-3xl font-bold text-emerald-500">{activeNodes}</div>
//           <div className="text-xs text-slate-300 uppercase tracking-widest font-semibold">Active Drones</div>
//         </div>

//         <button 
//           onClick={() => setShowPredicted(p => !p)}
//           className={`px-4 py-3 rounded-md text-xs font-bold transition-all shadow-lg border ${
//             showPredicted 
//               ? 'bg-red-500/90 text-white border-red-400 hover:bg-red-600' 
//               : 'bg-slate-800/90 text-slate-300 border-slate-600 hover:bg-slate-700'
//           }`}
//         >
//           {showPredicted ? '🔴 HIDE AI HEATMAP' : '🔵 SHOW AI HEATMAP'}
//         </button>
//       </div>
      
//       {/* Map Container */}
//       <div ref={containerRef} className="w-full h-full z-0" />
//     </div>
//   );
// }



// import { useEffect, useRef, useState } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import type { MatchResult, ZonePrediction } from '../types/polaris';

// interface MapState {
//   map: L.Map;
//   markersLayer: L.LayerGroup;
//   hotspotsLayer: L.LayerGroup;
// }

// export default function MapDashboard() {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const mapRef = useRef<MapState | null>(null);
//   const [activeNodes, setActiveNodes] = useState(0);
//   const [showPredicted, setShowPredicted] = useState(true);

//   useEffect(() => {
//     // 1. Prevent double initialization
//     if (!containerRef.current || mapRef.current) return;

//     // 2. Initialize Map
//     const map = L.map(containerRef.current, { zoomControl: false }).setView([13.04, 80.24], 12);
//     L.control.zoom({ position: 'topright' }).addTo(map);

//     L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
//       attribution: '&copy; CARTO'
//     }).addTo(map);

//     const markersLayer = L.layerGroup().addTo(map);
//     const hotspotsLayer = L.layerGroup().addTo(map);

//     mapRef.current = { map, markersLayer, hotspotsLayer };
//     setTimeout(() => {
//       map.invalidateSize();
//     }, 400);
//     // FIX: Force Leaflet to recalculate its size after a short delay
//     // This entirely prevents the "grey tile" cutoff glitch!
//     setTimeout(() => {
//       map.invalidateSize();
//     }, 250);

//     // 3. Drone Icon
//     const droneIcon = L.divIcon({ html: '🚁', className: 'custom-div-icon', iconSize: [24, 24] });

//     // 4. Fetch Live Drone Data
//     const fetchSpatialData = async () => {
//       try {
//         const res = await fetch(`http://localhost:6081/api/v1/nodes/match?lat=13.04&lon=80.24&radius_km=50&class=16&tenant_id=alpha_logistics`);
//         const json = await res.json();
//         const data: MatchResult[] = Array.isArray(json.data) ? json.data : [];

//         if (mapRef.current) {
//           const { markersLayer } = mapRef.current;
//           markersLayer.clearLayers();

//           data.forEach(node => {
//             L.marker([node.lat, node.lon], { icon: droneIcon })
//              .bindPopup(`<strong style="color:#10b981">${node.node_id}</strong><br>Distance: ${node.distance_km.toFixed(2)} km`)
//              .addTo(markersLayer);
//           });
//           setActiveNodes(data.length);
//         }
//       } catch (err) { /* Silent fail */ }
//     };

//     // 5. Fetch AI Predictions
//     const fetchPredictedZones = async () => {
//       try {
//         const res = await fetch(`http://localhost:6081/api/v1/zones/predicted`);
//         const json = await res.json();

//         if (json.status === "success" && mapRef.current) {
//           const { hotspotsLayer } = mapRef.current;
//           hotspotsLayer.clearLayers();

//           console.log("Live Rebalancing Suggestions:", json.data.rebalance);

//           // Synthetic coordinates around Chennai
//           const syntheticCoords = [
//              [13.0827, 80.2707], [13.0102, 80.2553], [12.9716, 80.2186], 
//              [13.0475, 80.2089], [12.9915, 80.1925], [13.0500, 80.2000],
//              [13.0600, 80.2100], [13.0700, 80.2200], [13.0800, 80.2300],
//              [13.0900, 80.2400], [13.1000, 80.2500], [13.1100, 80.2600],
//              [13.1200, 80.2700], [13.1300, 80.2800], [13.1400, 80.2900],
//              [13.1500, 80.3000], [13.1600, 80.3100], [13.1700, 80.3200],
//              [13.1800, 80.3300], [13.1900, 80.3400]
//           ];

//           // Draw Glowing Native Circles for the AI Hot Zones
//           if (json.data && json.data.hot_zones) {
//               json.data.hot_zones.forEach((zoneIndex: number) => {
//                 const coord = syntheticCoords[zoneIndex % syntheticCoords.length];
                
//                 L.circle(coord as [number, number], {
//                   color: '#ef4444',     // Red border
//                   weight: 2,
//                   fillColor: '#ef4444', // Red fill
//                   fillOpacity: 0.4,
//                   radius: 2000          // 2km radius
//                 }).bindPopup(`
//                   <b>🤖 AI Forecast</b><br>
//                   Zone ID: ${zoneIndex}<br>
//                   Status: <span style="color:#ef4444; font-weight:bold;">Demand Spike Imminent</span>
//                 `).addTo(hotspotsLayer);
//               });
//           }
//         }
//       } catch (err) {
//          console.error("Failed to fetch AI predictions", err);
//       }
//     };

//     const i1 = setInterval(fetchSpatialData, 1000);
//     const i2 = setInterval(fetchPredictedZones, 5000);
//     fetchPredictedZones(); // Initial fetch

//     return () => {
//       clearInterval(i1);
//       clearInterval(i2);
//       if (mapRef.current) {
//         mapRef.current.map.remove();
//         mapRef.current = null;
//       }
//     };
//   }, []);

//   // Handle the Toggle Button
//   useEffect(() => {
//     if (!mapRef.current) return;
//     const { map, hotspotsLayer } = mapRef.current;
    
//     if (showPredicted) {
//       if (!map.hasLayer(hotspotsLayer)) map.addLayer(hotspotsLayer);
//     } else {
//       if (map.hasLayer(hotspotsLayer)) map.removeLayer(hotspotsLayer);
//     }
//   }, [showPredicted]);

//   return (
//     <div className="w-full relative px-4 pb-4">
//       <div className="w-full relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900" 
//            style={{ height: '600px' }}>
        
//         {/* Overlay UI */}
//         <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3">
//           <div className="bg-slate-800/95 p-4 rounded-lg border border-slate-600 shadow-xl backdrop-blur-md">
//             <div className="text-3xl font-bold text-emerald-500">{activeNodes}</div>
//             <div className="text-xs text-slate-300 uppercase tracking-widest font-bold">Active Drones</div>
//           </div>

//           <button 
//             onClick={() => setShowPredicted(p => !p)}
//             className={`px-4 py-3 rounded-md text-xs font-bold transition-all shadow-lg border ${
//               showPredicted 
//                 ? 'bg-red-500/90 text-white border-red-400' 
//                 : 'bg-slate-800/90 text-slate-300 border-slate-600'
//             }`}
//           >
//             {showPredicted ? '🔴 HIDE AI FORECAST' : '🔵 SHOW AI FORECAST'}
//           </button>
//         </div>
        
//         {/* Actual Map Element */}
//         <div ref={containerRef} className="w-full h-full" />
//       </div>
//     </div>
//   );

// }


import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MatchResult } from '../types/polaris';

interface MapState {
  map: L.Map;
  markersLayer: L.LayerGroup;
  hotspotsLayer: L.LayerGroup;
}

export default function MapDashboard() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapState | null>(null);
  const [activeNodes, setActiveNodes] = useState(0);
  const [showPredicted, setShowPredicted] = useState(true);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // 1. Initialize Map
    // We set the background color to dark immediately so we can see if the div is alive
    const map = L.map(containerRef.current, { 
      zoomControl: false,
      attributionControl: false 
    }).setView([13.04, 80.24], 11);

    // 2. Add Tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    const hotspotsLayer = L.layerGroup().addTo(map);

    mapRef.current = { map, markersLayer, hotspotsLayer };

    // 3. FORCE REDRAW: This is critical for React
    setTimeout(() => {
      map.invalidateSize();
    }, 500);

    const droneIcon = L.divIcon({ 
        html: '<div style="font-size: 24px;">🚁</div>', 
        className: 'drone-marker', 
        iconSize: [30, 30] 
    });

    const fetchSpatialData = async () => {
      try {
        const res = await fetch(`http://localhost:6081/api/v1/nodes/match?lat=13.04&lon=80.24&radius_km=50&class=16&tenant_id=alpha_logistics`);
        const json = await res.json();
        const data: MatchResult[] = Array.isArray(json.data) ? json.data : [];

        if (mapRef.current) {
          mapRef.current.markersLayer.clearLayers();
          data.forEach(node => {
            L.marker([node.lat, node.lon], { icon: droneIcon }).addTo(mapRef.current!.markersLayer);
          });
          setActiveNodes(data.length);
        }
      } catch (e) { console.error("Drone fetch error", e); }
    };

    const fetchPredictedZones = async () => {
      try {
        const res = await fetch(`http://localhost:6081/api/v1/zones/predicted`);
        const json = await res.json();

        if (json.status === "success" && mapRef.current) {
          const { hotspotsLayer } = mapRef.current;
          hotspotsLayer.clearLayers();

          // NEW LOGIC: Iterate directly over json.data
          // because the backend already attached the lat/lon!
          json.data.forEach((zone: any) => {
            L.circle([zone.lat, zone.lon], {
              color: '#ef4444',
              weight: 2,
              fillColor: '#ef4444',
              fillOpacity: 0.4,
              radius: zone.radius_km * 1000 // Convert km to meters for Leaflet
            }).bindPopup(`
              <b>🤖 AI Forecast</b><br>
              Zone ID: ${zone.id}<br>
              Status: <span style="color:#ef4444; font-weight:bold;">${zone.status}</span>
            `).addTo(hotspotsLayer);
          });
          
          console.log("Rebalancing Meta-Data:", json.raw_rebalance);
        }
      } catch (err) {
         console.error("AI fetch failed", err);
      }
    };

    const i1 = setInterval(fetchSpatialData, 2000);
    const i2 = setInterval(fetchPredictedZones, 5000);
    fetchPredictedZones();
    fetchSpatialData();

    return () => {
      clearInterval(i1); clearInterval(i2);
      if (mapRef.current) { mapRef.current.map.remove(); mapRef.current = null; }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (showPredicted) mapRef.current.map.addLayer(mapRef.current.hotspotsLayer);
    else mapRef.current.map.removeLayer(mapRef.current.hotspotsLayer);
  }, [showPredicted]);

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 flex flex-col">
      {/* 1. Header Area */}
      <div className="p-6 text-center z-50">
          {/* Your Polaris Logo & Header go here */}
      </div>

      {/* 2. Map Section - Force height to fill screen */}
      <div className="relative flex-grow w-full overflow-hidden">
        
        {/* Floating Controls */}
        <div className="absolute top-10 left-10 z-[2000] flex flex-col gap-4 pointer-events-none">
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl pointer-events-auto">
            <div className="text-5xl font-black text-emerald-400 tabular-nums">{activeNodes}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mt-2">Active Drone Fleet</div>
          </div>

          <button 
            onClick={() => setShowPredicted(!showPredicted)}
            className={`pointer-events-auto px-6 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all border shadow-2xl ${
              showPredicted 
                ? 'bg-red-600 text-white border-red-400' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showPredicted ? '🔴 HIDE AI FORECAST' : '🔵 SHOW AI FORECAST'}
          </button>
        </div>
        
        {/* The Actual Map Div - Force it to be visible */}
        <div 
          ref={containerRef} 
          className="absolute inset-0 w-full h-full bg-slate-900" 
          style={{ zIndex: 1, minHeight: '500px' }} 
        />
      </div>

      <style>{`
        .leaflet-container { 
            background-color: #0f172a !important; 
            width: 100% !important; 
            height: 100% !important; 
        }
        .drone-marker { filter: drop-shadow(0 0 10px #10b981); }
      `}</style>
    </div>
  );
}