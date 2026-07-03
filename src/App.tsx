/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { COUNTRIES } from './data/countries';
import { Country } from './types';
import MapLayer from './components/MapLayer';
import PredictivePanel from './components/PredictivePanel';
import TrainingPanel from './components/TrainingPanel';
import HistoricalPanel from './components/HistoricalPanel';
import MethodologyPanel from './components/MethodologyPanel';
import { 
  Globe, 
  Cpu, 
  Terminal, 
  Sliders, 
  Database, 
  Thermometer, 
  Droplet, 
  Sprout, 
  BrainCircuit, 
  ArrowRight, 
  Layers, 
  Compass, 
  Sparkles, 
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'dashboard' | 'historical' | 'methodology' | 'training'>('overview');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // Default to Nigeria
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Animated bars state for miniature hero training chart
  const [miniBars, setMiniBars] = useState<number[]>([65, 80, 50, 75, 85, 70, 80, 35, 75, 50, 65, 45]);

  useEffect(() => {
    // Fluctuating mini bars in the hero training metric card for live sensory feel
    const interval = setInterval(() => {
      setMiniBars((prev) =>
        prev.map((v) => {
          const delta = (Math.random() - 0.5) * 10;
          return Math.max(15, Math.min(95, v + delta));
        })
      );
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-secondary-container selection:text-on-secondary-fixed">
      
      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-outline-variant h-16 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-full">
          <div 
            className="font-headline-md text-xl md:text-2xl font-bold text-primary cursor-pointer flex items-center gap-2"
            onClick={() => setActiveTab('overview')}
          >
            <Globe className="w-6 h-6 text-primary" />
            <span>West African Climate AI</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`font-label-md text-xs uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`font-label-md text-xs uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Predictive Dashboard
            </button>
            <button
              onClick={() => setActiveTab('historical')}
              className={`font-label-md text-xs uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                activeTab === 'historical'
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Historical Data
            </button>
            <button
              onClick={() => setActiveTab('methodology')}
              className={`font-label-md text-xs uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                activeTab === 'methodology'
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Methodology
            </button>
          </div>

          <div className="hidden lg:block">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-[#003527] text-white border border-emerald-800 font-label-md text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded shadow-sm hover:bg-emerald-900 active:scale-95 transition-all cursor-pointer"
            >
              Launch Prediction Engine
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-slate-700 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-outline-variant px-6 py-4 space-y-3.5 shadow-md flex flex-col">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'dashboard', label: 'Predictive Dashboard' },
              { id: 'historical', label: 'Historical Data' },
              { id: 'methodology', label: 'Methodology' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-semibold py-1.5 ${
                  activeTab === tab.id ? 'text-primary border-l-4 border-primary pl-2' : 'text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-[#003527] text-white text-center font-bold text-xs uppercase py-2.5 rounded mt-2 border border-emerald-800"
            >
              Launch Prediction Engine
            </button>
          </div>
        )}
      </nav>

      {/* MAIN BODY WORKSPACE */}
      <main className="flex-1 pt-16">
        
        {/* OVERVIEW TAB VIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* HERO BANNER SECTION */}
            <section className="relative bg-white border-b border-outline-variant py-20 px-6 md:px-12">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
                {/* Text Block */}
                <div className="lg:w-3/5 space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-emerald-50 px-3.5 py-1.5 rounded-sm border border-emerald-200">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="font-label-md text-xs text-primary uppercase tracking-wider">
                      Research Phase: 2026 Prediction Model
                    </span>
                  </div>
                  <h1 className="font-headline-xl text-4xl md:text-5xl text-primary leading-tight font-bold">
                    Artificial Intelligence-Based Climate Change Impact Prediction in West Africa
                  </h1>
                  <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                    Leveraging machine learning architectures to transform historical climate records into actionable localized insights for temperature anomalies and precipitation variability across the sub-region.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="bg-[#fe932c] text-on-secondary-fixed font-label-md text-xs font-bold px-8 py-4 rounded-lg flex items-center space-x-2 hover:brightness-110 transition-all cursor-pointer group"
                    >
                      <span>Access AI Dashboard</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                      onClick={() => setActiveTab('methodology')}
                      className="bg-white border border-slate-300 text-primary font-label-md text-xs font-bold px-8 py-4 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      View Methodology
                    </button>
                  </div>
                </div>

                {/* Training Metric miniature Card */}
                <div className="lg:w-2/5 w-full flex justify-center">
                  <div 
                    onClick={() => setActiveTab('training')}
                    className="w-full aspect-square max-w-md bg-white border border-outline-variant p-6 rounded shadow-lg relative overflow-hidden flex flex-col justify-between cursor-pointer group hover:border-primary transition-all duration-300"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-label-md text-xs uppercase text-slate-500 tracking-wider">Live Training Metrics</span>
                      <span className="font-mono-data text-xs text-primary font-bold animate-pulse flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                        Recurrent Stream
                      </span>
                    </div>

                    <div className="h-48 flex items-end justify-between space-x-1.5 pt-6 pb-2 border-b border-outline-variant/30">
                      {miniBars.map((val, idx) => {
                        let colorClass = 'bg-[#95d3ba]'; // primary-fixed-dim
                        if (idx === 4 || idx === 7) colorClass = 'bg-[#fe932c] animate-pulse'; // orange
                        else if (idx % 2 === 0) colorClass = 'bg-[#003527]'; // primary emerald
                        
                        return (
                          <div
                            key={idx}
                            className={`${colorClass} rounded-t-sm transition-all duration-500 flex-1`}
                            style={{ height: `${val}%` }}
                          ></div>
                        );
                      })}
                    </div>

                    <div className="pt-4 flex justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy Index</span>
                        <span className="font-headline-md text-xl text-primary font-mono-data">0.942</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Convergence</span>
                        <span className="font-headline-md text-xl text-orange-600 font-bold">Optimal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* VULNERABILITIES GRID SECTION */}
            <section className="py-20 px-6 md:px-12 bg-surface-container-low">
              <div className="max-w-7xl mx-auto">
                <div className="mb-14">
                  <h2 className="font-headline-lg text-3xl text-primary font-bold mb-3">Core Vulnerabilities Monitored</h2>
                  <p className="font-body-md text-base text-on-surface-variant max-w-3xl leading-relaxed">
                    West Africa faces a unique intersection of climatic stressors and socio-economic dependencies. Our AI model prioritizes four critical domains to ensure predictive relevance for sub-regional policy frameworks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="group bg-white p-6 border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-[#f1f3ff] transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-primary/5 text-primary flex items-center justify-center rounded-sm mb-5 border border-primary/10">
                        <Thermometer className="w-6 h-6" />
                      </div>
                      <h3 className="font-headline-md text-xl text-primary mb-3">Temperature Anomalies</h3>
                      <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                        Tracking long-term regional warming patterns and extreme heat thresholds through multi-layered thermal data processing.
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="group bg-white p-6 border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-[#f1f3ff] transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-primary/5 text-primary flex items-center justify-center rounded-sm mb-5 border border-primary/10">
                        <Droplet className="w-6 h-6" />
                      </div>
                      <h3 className="font-headline-md text-xl text-primary mb-3">Precipitation Shifts</h3>
                      <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                        Analyzing erratic rainfall distribution, prolonged dry spells, and localized flooding occurrences using recursive neural networks.
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="group bg-white p-6 border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-[#f1f3ff] transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-primary/5 text-primary flex items-center justify-center rounded-sm mb-5 border border-primary/10">
                        <Sprout className="w-6 h-6" />
                      </div>
                      <h3 className="font-headline-md text-xl text-primary mb-3">Agricultural Vulnerability</h3>
                      <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                        Evaluating the direct operational risks posed to the region's heavy reliance on rain-fed farming systems and livestock cycles.
                      </p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="group bg-white p-6 border border-outline-variant rounded shadow-sm hover:border-primary hover:bg-[#f1f3ff] transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-primary/5 text-primary flex items-center justify-center rounded-sm mb-5 border border-primary/10">
                        <Database className="w-6 h-6" />
                      </div>
                      <h3 className="font-headline-md text-xl text-primary mb-3">Data-Constrained Adaptation</h3>
                      <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                        Utilizing computational data science to overcome historical weather monitoring infrastructure gaps through synthetic augmentation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TECHNICAL SYSTEM FRAMEWORK (Dark Section) */}
            <section className="bg-primary py-20 px-6 md:px-12 text-white">
              <div className="max-w-7xl mx-auto space-y-14">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-emerald-950 pb-8">
                  <div className="max-w-2xl">
                    <h2 className="font-headline-lg text-3xl mb-3 text-on-primary-container font-bold">Engine Specifications & Academic Framework</h2>
                    <p className="font-body-md text-base text-slate-300 leading-relaxed">
                      The computational backend integrates disparate meteorological inputs into a unified forecasting matrix, optimized for the diverse eco-climatic zones of West Africa.
                    </p>
                  </div>
                  <div className="bg-emerald-950/40 border border-emerald-800 p-4 rounded backdrop-blur-sm">
                    <span className="font-label-md text-xs text-[#80bea6] uppercase tracking-widest block font-bold">
                      Compute Environment: TensorFlow Core v2.x
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-emerald-900 rounded overflow-hidden">
                  <div className="p-8 bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors border-b md:border-b-0 md:border-r border-emerald-900">
                    <div className="font-label-md text-xs text-[#80bea6] mb-2 uppercase tracking-wide font-bold">Core Models</div>
                    <div className="font-headline-xl text-3xl mb-3 font-bold">2 ML Models</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Linear Regression Baseline & Artificial Neural Network (ANN) via high-performance computation.
                    </p>
                  </div>

                  <div className="p-8 bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors border-b md:border-b-0 md:border-r border-emerald-900">
                    <div className="font-label-md text-xs text-[#80bea6] mb-2 uppercase tracking-wide font-bold">Accuracy Assessment</div>
                    <div className="font-headline-xl text-3xl mb-3 font-bold">3 Metrics</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Automated computation of Mean Absolute Error (MAE), RMSE, and R² Co-efficient for validation.
                    </p>
                  </div>

                  <div className="p-8 bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors border-b lg:border-b-0 lg:border-r border-emerald-900">
                    <div className="font-label-md text-xs text-[#80bea6] mb-2 uppercase tracking-wide font-bold">Input Feature Set</div>
                    <div className="font-headline-xl text-3xl mb-3 font-bold">Core Vars</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Surface Temperature (°C) and Precipitation Volume (mm) mapping across temporal scales.
                    </p>
                  </div>

                  <div className="p-8 bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors">
                    <div className="font-label-md text-xs text-[#80bea6] mb-2 uppercase tracking-wide font-bold">Spatial Domain</div>
                    <div className="font-headline-xl text-3xl mb-3 font-bold">ECOWAS</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Sub-regional analysis localized to West African ECOWAS ecosystems and border-climate zones.
                    </p>
                  </div>
                </div>

                {/* Hotlinked academic images cards row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div className="flex items-start space-x-4 p-4 rounded bg-emerald-950/10 border border-emerald-900/30">
                    <div 
                      className="w-16 h-16 rounded bg-cover bg-center shrink-0 border border-emerald-800"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfv-fvRdA7SbZZmpU9pKPMs800HnZE50_Jf5H40-eM7vvQrxpLO6w4Jz3GYVRwXFKp010m34aqSXc3iClJkluBEeA1Qlc1RLExJovzeL0Y72ZfmblSTEdYAFcYnaP_zGO_pglPA7tGdEokVJeZYLxArcAiwz-GWdkCIF4U6LqGEtse3_L6mt3zOCzHCthOYqj5EPgTgxUCza7HFzE_v-jCjXMn42XswZgb4C7pifgAcvGhVGi_dt-tag')" }}
                    ></div>
                    <div>
                      <h4 className="font-label-md text-xs text-on-primary-container uppercase tracking-wider mb-1 font-bold">Architecture</h4>
                      <p className="text-xs text-slate-400 italic">Sequential Layer Dense Network</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded bg-emerald-950/10 border border-emerald-900/30">
                    <div 
                      className="w-16 h-16 rounded bg-cover bg-center shrink-0 border border-emerald-800"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCNNe46R0EUUAQs3fvKJdsRaRARHzNAP15yHM5oOvbhnWczA6QdRmxS__ks5RxxuDEkkO9UO1IzyJ-ZomK2lmIZZ5DGaXPwm-kzrIgGyw9deQ2IfX7anWoBqoAfi_1HV1wF8v8YCD8bCubLC2GPdzMp-PrZlmLLCXrLskA7pWU_vX3M3aQ-NUyGbLYfGRpU9qHmuch9uQWF0Egmll7f_WYzP3PPY-kJQkJAlFGWfQjeDGRx8XsUd7Yn-w')" }}
                    ></div>
                    <div>
                      <h4 className="font-label-md text-xs text-on-primary-container uppercase tracking-wider mb-1 font-bold">GIS Integration</h4>
                      <p className="text-xs text-slate-400 italic">Raster-to-Vector Normalization</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded bg-emerald-950/10 border border-emerald-900/30">
                    <div 
                      className="w-16 h-16 rounded bg-cover bg-center shrink-0 border border-emerald-800"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuANi-K75YCxFQLIAeNnN7z4QRYIqo2FKwupkxKIqrQr_KcNHs9TYrCVxX5vgO7dEJmETVmXUmJ1SD8KHTSQpuWEVZCz3kd53krXfKDNqrJdgtw_PmLNzLETcaZ9WyWVD9OUw-BYZubuHd4rToPWvmdJpRvkgWr7NdusumaPId8Vw3r_FW9fdFdinDSROot-_U6bF6z4Y8sZecK4nDpY1M9HT85B0Pp4ri4ivElHArdJq-c9NZM-XBk-ew')" }}
                    ></div>
                    <div>
                      <h4 className="font-label-md text-xs text-on-primary-container uppercase tracking-wider mb-1 font-bold">Optimization</h4>
                      <p className="text-xs text-slate-400 italic">Adam Optimizer Stochastics</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* BENTO LAYOUT HIGHLIGHT */}
            <section className="py-20 px-6 md:px-12 bg-white">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col items-center text-center">
                  <span className="font-label-md text-xs text-[#fe932c] uppercase tracking-widest font-bold mb-1.5">Platform Interface</span>
                  <h2 className="font-headline-lg text-3xl text-primary font-bold">Advanced Analytics Environment</h2>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                  {/* Left Column: Interactive Spatial Layer */}
                  <div className="xl:col-span-8">
                    <MapLayer 
                      selectedCountry={selectedCountry} 
                      onSelectCountry={handleSelectCountry} 
                    />
                  </div>

                  {/* Right Column Sidebar alerts */}
                  <div className="xl:col-span-4 flex flex-col justify-between gap-6">
                    {/* Live Alert feed */}
                    <div className="bg-[#fcf8f2] border border-[#f5d0a9] p-6 rounded flex-1">
                      <h4 className="font-label-md text-xs text-amber-700 uppercase tracking-wider font-bold mb-4">Live Alert Feed</h4>
                      <div className="space-y-3.5">
                        <div className="p-3.5 border-l-4 border-[#fe932c] bg-white shadow-sm rounded-sm">
                          <p className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">NIGER DELTA BASIN</p>
                          <p className="font-body-sm text-sm font-bold text-slate-800 mt-1">Projected +2.4°C Anomaly</p>
                        </div>
                        <div className="p-3.5 border-l-4 border-primary bg-white shadow-sm rounded-sm">
                          <p className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">SAHEL REGION</p>
                          <p className="font-body-sm text-sm font-bold text-slate-800 mt-1">Precipitation Variance 12%</p>
                        </div>
                      </div>
                    </div>

                    {/* Confidence score card */}
                    <div 
                      onClick={() => setActiveTab('dashboard')}
                      className="bg-primary text-white p-6 rounded shadow-xl flex flex-col justify-between h-[210px] cursor-pointer group hover:bg-primary-container transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Sparkles className="w-8 h-8 text-[#80bea6] mb-3 group-hover:scale-110 transition-transform" />
                          <h4 className="font-headline-md text-xl font-bold">Prediction Confidence</h4>
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between border-t border-emerald-950 pt-4 mt-4">
                        <div className="text-4xl font-extrabold font-mono-data text-emerald-300">92%</div>
                        <div className="text-[10px] font-mono text-slate-400">Validated Batch #2904</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PREDICTIVE DASHBOARD WORKSPACE */}
        {activeTab === 'dashboard' && (
          <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div>
              <h2 className="font-headline-xl text-3xl md:text-4xl text-primary font-bold">Predictive Dashboard</h2>
              <p className="text-sm text-[#404944] font-body-sm mt-2 max-w-3xl leading-relaxed">
                Execute high-resolution climate simulations for West African territories using validated neural network architectures.
              </p>
            </div>

            {/* Core Predictive parameters and interactive results */}
            <PredictivePanel selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} />
          </section>
        )}

        {/* HISTORICAL TAB */}
        {activeTab === 'historical' && (
          <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto animate-fade-in">
            <HistoricalPanel />
          </section>
        )}

        {/* METHODOLOGY TAB */}
        {activeTab === 'methodology' && (
          <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto animate-fade-in">
            <MethodologyPanel />
          </section>
        )}

        {/* TRAINING TAB */}
        {activeTab === 'training' && (
          <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto animate-fade-in">
            <TrainingPanel />
          </section>
        )}
      </main>

      {/* ACADEMIC FOOTER */}
      <footer className="bg-white border-t border-outline-variant py-6">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          <div>
            © 2026 ALL RIGHTS RESERVED
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:space-x-8 text-center md:text-right mt-3 md:mt-0">
            <span>Researcher: Okafor Chukwuoma Deborah</span>
            <span>Matric No: U2022/5570029</span>
            <span>Department of Computer Science</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
