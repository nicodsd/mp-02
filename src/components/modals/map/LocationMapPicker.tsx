"use client";

import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaCrosshairs, FaMapMarkerAlt, FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import { reverseGeocode, searchAddress } from "@/src/utils/orders";

// Coordenadas base por defecto (Santiago del Estero, Argentina)
const DEFAULT_LAT = -27.7833;
const DEFAULT_LNG = -64.2667;
const DEFAULT_ZOOM = 15;

export interface LocationMapPickerProps {
    initialLat?: number;
    initialLng?: number;
    onLocationChange: (data: {
        lat: number;
        lng: number;
        addressText?: string;
        isLoadingAddress: boolean;
    }) => void;
}

export interface LocationMapPickerHandle {
    moveToCoords: (lat: number, lng: number, zoom?: number) => void;
}

const LocationMapPicker = forwardRef<LocationMapPickerHandle, LocationMapPickerProps>(
    function LocationMapPicker(
        {
            initialLat = DEFAULT_LAT,
            initialLng = DEFAULT_LNG,
            onLocationChange,
        },
        ref
    ) {
        const mapContainerRef = useRef<HTMLDivElement | null>(null);
        const mapInstanceRef = useRef<L.Map | null>(null);
        const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
        const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
        const abortControllerRef = useRef<AbortController | null>(null);
        const searchAbortRef = useRef<AbortController | null>(null);
        const onLocationChangeRef = useRef(onLocationChange);

        const [isMoving, setIsMoving] = useState(false);
        const [isLocatingGps, setIsLocatingGps] = useState(false);
        const [isGeocoding, setIsGeocoding] = useState(false);
        const [coords, setCoords] = useState<{ lat: number; lng: number }>({
            lat: initialLat,
            lng: initialLng,
        });

        // Buscador integrado en el mapa
        const [searchQuery, setSearchQuery] = useState("");
        const [searchResults, setSearchResults] = useState<
            Array<{ lat: number; lng: number; displayName: string }>
        >([]);
        const [isSearching, setIsSearching] = useState(false);
        const [showResults, setShowResults] = useState(false);

        useEffect(() => {
            onLocationChangeRef.current = onLocationChange;
        }, [onLocationChange]);

        const fetchAddressForCoords = useCallback((lat: number, lng: number) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            setIsGeocoding(true);
            onLocationChangeRef.current({
                lat,
                lng,
                isLoadingAddress: true,
            });

            debounceTimerRef.current = setTimeout(async () => {
                const controller = new AbortController();
                abortControllerRef.current = controller;

                try {
                    const addressText = await reverseGeocode(lat, lng, controller.signal);
                    setIsGeocoding(false);
                    onLocationChangeRef.current({
                        lat,
                        lng,
                        addressText,
                        isLoadingAddress: false,
                    });
                } catch (err: any) {
                    if (err?.name === "AbortError") return;
                    setIsGeocoding(false);
                    onLocationChangeRef.current({
                        lat,
                        lng,
                        isLoadingAddress: false,
                    });
                }
            }, 400);
        }, []);

        const moveToCoords = useCallback((lat: number, lng: number, zoom = 17) => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([lat, lng], zoom, { animate: true });
            }
        }, []);

        useImperativeHandle(ref, () => ({
            moveToCoords,
        }), [moveToCoords]);

        const handleCenterOnUserGps = useCallback(() => {
            if (typeof window === "undefined" || !("geolocation" in navigator)) return;

            setIsLocatingGps(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setIsLocatingGps(false);
                    moveToCoords(latitude, longitude, 17);
                },
                () => {
                    setIsLocatingGps(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 7000,
                    maximumAge: 60000,
                }
            );
        }, [moveToCoords]);

        // Manejo de búsqueda predictiva
        const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setSearchQuery(val);

            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
            if (searchAbortRef.current) searchAbortRef.current.abort();

            if (val.trim().length < 3) {
                setSearchResults([]);
                setShowResults(false);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            setShowResults(true);

            searchTimerRef.current = setTimeout(async () => {
                const controller = new AbortController();
                searchAbortRef.current = controller;
                try {
                    const results = await searchAddress(val, controller.signal);
                    setSearchResults(results);
                } catch {
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            }, 500);
        };

        const handleSelectSearchResult = (result: { lat: number; lng: number; displayName: string }) => {
            setShowResults(false);
            setSearchQuery(result.displayName.split(",").slice(0, 2).join(",").trim());
            moveToCoords(result.lat, result.lng, 17);
        };

        useEffect(() => {
            if (!mapContainerRef.current || mapInstanceRef.current) return;

            // 1. Inicializar Leaflet
            const map = L.map(mapContainerRef.current, {
                center: [initialLat, initialLng],
                zoom: DEFAULT_ZOOM,
                zoomControl: false,
                attributionControl: true,
            });

            // 2. Capa de tiles liviana CartoDB Positron
            const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY?.trim();
            const tileUrl = apiKey
                ? `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${apiKey}`
                : `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`;
            L.tileLayer(tileUrl, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom: 18,
                subdomains: "abcd",
            }).addTo(map);

            // Control de zoom compacto en esquina superior izquierda (debajo del buscador)
            L.control.zoom({ position: "bottomleft" }).addTo(map);

            // 3. Eventos de movimiento
            map.on("movestart", () => {
                setIsMoving(true);
                setShowResults(false);
            });

            map.on("moveend", () => {
                setIsMoving(false);
                const center = map.getCenter();
                const roundedLat = Number(center.lat.toFixed(6));
                const roundedLng = Number(center.lng.toFixed(6));
                setCoords({ lat: roundedLat, lng: roundedLng });
                fetchAddressForCoords(roundedLat, roundedLng);
            });

            mapInstanceRef.current = map;

            // Asegurar tamaño del contenedor al renderizar y ante resize
            const invalidate = () => {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.invalidateSize();
                }
            };
            setTimeout(invalidate, 100);
            setTimeout(invalidate, 300);
            setTimeout(invalidate, 600);

            window.addEventListener("resize", invalidate);

            fetchAddressForCoords(initialLat, initialLng);
            handleCenterOnUserGps();

            return () => {
                window.removeEventListener("resize", invalidate);
                if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
                if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                if (abortControllerRef.current) abortControllerRef.current.abort();
                if (searchAbortRef.current) searchAbortRef.current.abort();
                map.remove();
                mapInstanceRef.current = null;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <div className="relative w-full h-full min-h-75 rounded-2xl overflow-hidden border border-gray-300 shadow-inner bg-gray-100 select-none flex flex-col [&_.leaflet-top.leaflet-left]:top-14!">
                {/* Barra de búsqueda flotante dentro del mapa */}
                <div className="absolute top-2.5 left-2.5 right-2.5 z-100 flex flex-col">
                    <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-gray-200">
                        <FaSearch className="text-gray-400 ml-3 shrink-0" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar calle, barrio o ciudad..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onFocus={() => {
                                if (searchResults.length > 0) setShowResults(true);
                            }}
                            className="w-full py-2 px-2.5 text-xs sm:text-sm bg-transparent text-gray-800 placeholder-gray-400 outline-none"
                        />
                        {isSearching ? (
                            <FaSpinner className="animate-spin text-gray-400 mr-3 shrink-0" size={14} />
                        ) : searchQuery ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSearchResults([]);
                                    setShowResults(false);
                                }}
                                className="mr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <FaTimes size={13} />
                            </button>
                        ) : null}
                    </div>

                    {/* Lista desplegable de sugerencias de búsqueda */}
                    {showResults && searchResults.length > 0 && (
                        <div className="mt-1 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-48 overflow-y-auto divide-y divide-gray-100">
                            {searchResults.map((item, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelectSearchResult(item)}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-start gap-2 text-gray-700 transition-colors"
                                >
                                    <FaMapMarkerAlt className="text-red-500 mt-0.5 shrink-0" size={12} />
                                    <span className="line-clamp-2 leading-relaxed">{item.displayName}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Contenedor del mapa Leaflet */}
                <div ref={mapContainerRef} className="w-full flex-1 z-10" />

                {/* Píldora inferior de coordenadas / estado */}
                <div className="absolute bottom-3 left-12 pointer-events-none flex items-center">
                    <div className="bg-white/95 backdrop-blur-xs text-gray-800 text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-md border border-gray-200 flex items-center gap-1.5 truncate max-w-50 sm:max-w-none">
                        <span
                            className={`w-2 h-2 rounded-full shrink-0 ${isMoving || isGeocoding
                                ? "bg-amber-500 animate-pulse"
                                : "bg-green-500"
                                }`}
                        />
                        <span className="truncate">
                            {isMoving
                                ? "Mueve el mapa..."
                                : isGeocoding
                                    ? "Detectando calle..."
                                    : `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`}
                        </span>
                    </div>
                </div>

                {/* Pin Central Fijo (Patrón Pinned Marker) */}
                <div
                    className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
                    aria-hidden="true"
                >
                    <div className="relative flex flex-col items-center -translate-y-4">
                        <div
                            className={`transition-transform duration-150 ease-out ${isMoving ? "-translate-y-2.5 scale-110" : "translate-y-0 scale-100"
                                }`}
                        >
                            <div className="relative flex items-center justify-center">
                                <FaMapMarkerAlt className="text-red-600 drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] text-4xl" />
                                <span className="absolute top-2 w-2.5 h-2.5 bg-white rounded-full" />
                            </div>
                        </div>
                        {/* Sombra en el punto exacto de la coordenada central */}
                        <div
                            className={`rounded-full bg-black/60 transition-all duration-150 ${isMoving ? "w-2 h-1 opacity-40" : "w-3 h-1.5 opacity-75"
                                }`}
                        />
                    </div>
                </div>

                {/* Botón flotante para centrar en GPS actual */}
                <button
                    type="button"
                    onClick={handleCenterOnUserGps}
                    disabled={isLocatingGps}
                    title="Usar mi ubicación actual"
                    className="absolute bottom-3 right-3 z-400 bg-white hover:bg-gray-50 active:scale-95 text-gray-800 p-2.5 rounded-full shadow-lg border border-gray-200 cursor-pointer transition-all flex items-center justify-center disabled:opacity-60"
                >
                    <FaCrosshairs
                        size={17}
                        className={`${isLocatingGps ? "animate-spin text-green-600" : "text-gray-700"}`}
                    />
                </button>
            </div>
        );
    }
);

export default LocationMapPicker;
