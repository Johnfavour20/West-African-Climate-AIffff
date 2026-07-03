/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { COUNTRIES } from '../data/countries';
import { Country } from '../types';
import { Globe, MapPin, AlertTriangle, ShieldCheck, Thermometer, Info } from 'lucide-react';

interface MapLayerProps {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
}

export default function MapLayer({ selectedCountry, onSelectCountry }: MapLayerProps) {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);

  // Get color based on climate risk score
  const getRiskColor = (score: number, isActive: boolean) => {
    if (isActive) return 'fill-[#064e3b] stroke-white stroke-2';
    if (score > 80) return 'fill-[#7f1d1d]/30 stroke-[#ef4444] hover:fill-[#7f1d1d]/50';
    if (score > 70) return 'fill-[#b45309]/20 stroke-[#f59e0b] hover:fill-[#b45309]/40';
    if (score > 60) return 'fill-[#1e3a8a]/20 stroke-[#3b82f6] hover:fill-[#1e3a8a]/40';
    return 'fill-[#064e3b]/10 stroke-[#10b981] hover:fill-[#064e3b]/30';
  };

  return (
    <div id="map-layer-container" className="bg-white border border-outline-variant rounded p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Regional Risk Matrix
          </h3>
          <p className="text-xs text-on-surface-variant font-body-sm">
            Click any West African ECOWAS country to load localized training models and predict anomalies.
          </p>
        </div>
        <div className="flex space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" title="Active"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" title="High Risk"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" title="Moderate Risk"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* SVG Spatial Map */}
        <div className="lg:col-span-2 relative border border-outline-variant/30 rounded bg-slate-50 flex items-center justify-center p-4 min-h-[340px] overflow-hidden">
          {/* Latitude & Longitude Guidelines for academic touch */}
          <div className="absolute inset-0 pointer-events-none opacity-20 border border-dashed border-slate-300 grid grid-cols-6 grid-rows-6">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border-r border-b border-dashed border-slate-300"></div>
            ))}
          </div>

          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
            <MapPin className="w-3 h-3 text-red-500" />
            <span>12.5° N, 8.2° W (ECOWAS Domain)</span>
          </div>

          {/* SVG Map Container */}
          <svg
            viewBox="50 50 420 250"
            className="w-full h-auto max-h-[300px] z-10 drop-shadow-sm select-none"
          >
            {/* Ambient Background Grid Labels */}
            <text x="70" y="70" fill="#94a3b8" fontSize="8" fontFamily="monospace">15°N</text>
            <text x="70" y="170" fill="#94a3b8" fontSize="8" fontFamily="monospace">10°N</text>
            <text x="170" y="240" fill="#94a3b8" fontSize="8" fontFamily="monospace">0°</text>
            <text x="370" y="240" fill="#94a3b8" fontSize="8" fontFamily="monospace">10°E</text>

            <g className="transition-all duration-300">
              {COUNTRIES.map((c) => {
                const isActive = selectedCountry.id === c.id;
                return (
                  <path
                    key={c.id}
                    d={c.coordinates.path}
                    className={`cursor-pointer transition-all duration-300 ${getRiskColor(
                      c.riskScore,
                      isActive
                    )}`}
                    onClick={() => onSelectCountry(c)}
                    onMouseEnter={() => setHoveredCountry(c)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                );
              })}
            </g>

            {/* Labels on Map */}
            {COUNTRIES.map((c) => (
              <text
                key={`label-${c.id}`}
                x={c.coordinates.x}
                y={c.coordinates.y}
                fill={selectedCountry.id === c.id ? '#ffffff' : '#334155'}
                fontSize="9"
                fontWeight={selectedCountry.id === c.id ? '700' : '500'}
                fontFamily="sans-serif"
                textAnchor="middle"
                className="pointer-events-none drop-shadow-sm"
              >
                {c.code}
              </text>
            ))}
          </svg>
        </div>

        {/* Selected / Hovered Meta Sidebar */}
        <div className="flex flex-col justify-between p-4 rounded bg-[#f1f3ff] border border-outline-variant/50">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-outline-variant/30 pb-2">
              <span className="font-label-md text-label-md text-primary uppercase tracking-wider">
                Vulnerability Report
              </span>
              <span className="text-[10px] font-mono bg-primary-container text-white px-2 py-0.5 rounded-sm">
                Active Focal Point
              </span>
            </div>

            {/* Target Details */}
            {(() => {
              const displayTarget = hoveredCountry || selectedCountry;
              return (
                <div className="space-y-3.5">
                  <div>
                    <h4 className="font-headline-md text-lg text-primary leading-tight font-bold">
                      {displayTarget.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono-data mt-0.5">
                      Zone: {displayTarget.ecoZone}
                    </p>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {displayTarget.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3.5 bg-white p-2.5 rounded border border-outline-variant/30">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Baseline Temp</div>
                      <div className="text-sm font-bold text-primary font-mono-data mt-0.5 flex items-center gap-0.5">
                        <Thermometer className="w-3.5 h-3.5 text-orange-500 inline" />
                        {displayTarget.baselineTemp}°C
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Rain Volume</div>
                      <div className="text-sm font-bold text-primary font-mono-data mt-0.5">
                        {displayTarget.baselineRain} mm
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Eco-Vulnerability Index</span>
                      <span className={`font-bold font-mono-data ${displayTarget.vulnerabilityIndex > 0.75 ? 'text-red-600' : displayTarget.vulnerabilityIndex > 0.6 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {displayTarget.vulnerabilityIndex}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          displayTarget.vulnerabilityIndex > 0.75
                            ? 'bg-red-500'
                            : displayTarget.vulnerabilityIndex > 0.6
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${displayTarget.vulnerabilityIndex * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center gap-2 text-[10px] text-slate-500 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Hover or tap map sections to preview ecological baseline indexes.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
