/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { COUNTRIES, HISTORICAL_DATA } from '../data/countries';
import { Search, Download, Calendar, Thermometer, CloudRain, ArrowUpDown, ChevronRight } from 'lucide-react';

export default function HistoricalPanel() {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('nigeria');
  const [searchYear, setSearchYear] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const selectedCountry = COUNTRIES.find((c) => c.id === selectedCountryId) || COUNTRIES[0];
  const rawRecords = HISTORICAL_DATA[selectedCountryId] || [];

  // Filter records based on search year
  const filteredRecords = rawRecords.filter((rec) => {
    return rec.year.toString().includes(searchYear);
  });

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    return sortAsc ? a.year - b.year : b.year - a.year;
  });

  const handleExportCSV = () => {
    const headers = 'Year,Avg_Temperature_C,Precipitation_mm,Temperature_Anomaly_C\n';
    const rows = rawRecords
      .map((rec) => `${rec.year},${rec.temp},${rec.rain},${rec.anomaly}`)
      .join('\n');
    
    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `Historical_Climate_${selectedCountry.name}.csv`;
    link.click();
  };

  // Math dimensions for simplified SVG Line Chart
  const svgWidth = 500;
  const svgHeight = 150;
  const padding = 20;

  // Compute SVG Points for temperature anomaly line
  const computeTempPoints = () => {
    if (rawRecords.length === 0) return '';
    const xStep = (svgWidth - padding * 2) / (rawRecords.length - 1);
    
    // Anomaly ranges from -1.0 to +2.0
    const mapY = (val: number) => {
      const minVal = -1.0;
      const maxVal = 2.0;
      const percentage = (val - minVal) / (maxVal - minVal);
      return svgHeight - padding - percentage * (svgHeight - padding * 2);
    };

    return rawRecords
      .map((rec, index) => {
        const x = padding + index * xStep;
        const y = mapY(rec.anomaly);
        return `${x},${y}`;
      })
      .join(' L ');
  };

  return (
    <div id="historical-workspace" className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
      {/* Historical Side Chart */}
      <div className="xl:col-span-5 bg-white border border-outline-variant p-6 rounded shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-headline-md text-lg text-primary font-bold">Historical Record Vectors</h3>
          </div>
          <p className="text-xs text-on-surface-variant font-body-sm mb-6">
            Explore compiled meteorological benchmarks and thermal anomalies recorded across West Africa from 1980 to 2025.
          </p>

          {/* Select country to view */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Select Region/Country</label>
              <div className="grid grid-cols-2 gap-2">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCountryId(c.id)}
                    className={`p-2.5 rounded border text-left flex items-center justify-between transition-all duration-200 cursor-pointer text-xs font-semibold ${
                      selectedCountryId === c.id
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-outline-variant hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{c.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Trendline Chart */}
            <div className="border border-outline-variant/50 rounded bg-slate-50 p-4 relative overflow-hidden mt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Temperature Anomaly Trend (1980 - 2025)
                </span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  +1.3°C warming curve
                </span>
              </div>

              {/* Line Chart */}
              <div className="relative">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                  {/* Grid Lines */}
                  <line x1={padding} y1={svgHeight/2} x2={svgWidth - padding} y2={svgHeight/2} stroke="#cbd5e1" strokeDasharray="4" />
                  <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#f1f5f9" />
                  <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#f1f5f9" />

                  {/* Temperature Anomaly Path */}
                  {rawRecords.length > 0 && (
                    <path
                      d={`M ${computeTempPoints()}`}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Coordinates Markers */}
                  {rawRecords.map((rec, idx) => {
                    const xStep = (svgWidth - padding * 2) / (rawRecords.length - 1);
                    const minVal = -1.0;
                    const maxVal = 2.0;
                    const percentage = (rec.anomaly - minVal) / (maxVal - minVal);
                    const x = padding + idx * xStep;
                    const y = svgHeight - padding - percentage * (svgHeight - padding * 2);

                    return (
                      <g key={idx} className="group cursor-pointer">
                        <circle
                          cx={x}
                          cy={y}
                          r="3.5"
                          fill="#d97706"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        {/* Custom tooltip helper text */}
                        <text
                          x={x}
                          y={y - 8}
                          fontSize="7"
                          fontFamily="monospace"
                          fill="#1e293b"
                          textAnchor="middle"
                          className="opacity-0 group-hover:opacity-100 transition-opacity font-bold bg-white"
                        >
                          {rec.anomaly > 0 ? `+${rec.anomaly}` : rec.anomaly}°C
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mt-2">
                  <span>1980 Baseline</span>
                  <span>2000 Mean</span>
                  <span>2025 Present</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-outline-variant">
          <button
            onClick={handleExportCSV}
            className="w-full bg-primary hover:bg-primary-container text-white font-label-md text-xs font-bold py-3.5 px-6 rounded-lg flex items-center justify-center space-x-2 shadow transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Decadal CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="xl:col-span-7 bg-white border border-outline-variant rounded shadow-sm p-6 flex flex-col justify-between items-stretch">
        <div>
          {/* Table controls */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
            <div>
              <h4 className="font-headline-md text-lg text-primary font-bold">Meteorological Matrix</h4>
              <p className="text-[11px] text-slate-400 font-body-sm mt-0.5">
                Decadal historical climate values for {selectedCountry.name}.
              </p>
            </div>

            <div className="relative max-w-xs shrink-0 flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search year (e.g. 2020)..."
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                className="w-full border border-outline-variant/80 rounded bg-slate-50 py-2 pl-9 pr-4 text-xs focus:border-primary focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* Records table */}
          <div className="overflow-x-auto rounded border border-outline-variant/30">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-outline-variant/30 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <th className="py-3 px-4 cursor-pointer hover:text-primary transition-colors select-none" onClick={() => setSortAsc(!sortAsc)}>
                    <div className="flex items-center gap-1">
                      Year
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Avg Temperature</th>
                  <th className="py-3 px-4 text-right">Precipitation Volume</th>
                  <th className="py-3 px-4 text-right">Thermal Anomaly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-xs">
                {sortedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                      No historical files found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  sortedRecords.map((rec) => (
                    <tr key={rec.year} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-primary font-mono-data">{rec.year}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        <Thermometer className="w-3 h-3 text-orange-500 inline mr-0.5" />
                        {rec.temp.toFixed(1)}°C
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        <CloudRain className="w-3 h-3 text-blue-500 inline mr-0.5" />
                        {rec.rain} mm
                      </td>
                      <td className={`py-3 px-4 text-right font-bold font-mono-data ${rec.anomaly > 0 ? 'text-amber-600' : 'text-blue-600'}`}>
                        {rec.anomaly > 0 ? `+${rec.anomaly}` : rec.anomaly}°C
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-outline-variant/30 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Displaying {sortedRecords.length} decadal observations.</span>
          <span className="font-mono">Reference Domain: NOAA-GISS IPCC AR6</span>
        </div>
      </div>
    </div>
  );
}
