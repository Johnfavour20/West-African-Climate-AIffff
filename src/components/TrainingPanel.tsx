/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sliders, TrendingDown, Award, CheckCircle, Database } from 'lucide-react';
import { TrainingConfig } from '../types';

export default function TrainingPanel() {
  const [lr, setLr] = useState<number>(0.01);
  const [epochs, setEpochs] = useState<number>(500);
  const [modelType, setModelType] = useState<'ANN' | 'LSTM'>('LSTM');
  const [hiddenLayers, setHiddenLayers] = useState<number>(3);

  // Dynamic Datasets & Activity Logs states
  const [datasets, setDatasets] = useState<any[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Upload States
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState<string>('');
  const [datasetSource, setDatasetSource] = useState<string>('');
  const [datasetDesc, setDatasetDesc] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fetchDatasets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/datasets');
      if (res.ok) {
        const data = await res.json();
        setDatasets(data);
        if (data.length > 0 && selectedDatasetId === null) {
          setSelectedDatasetId(data[0].id);
        }
      }
    } catch (err) {
      console.warn('Could not fetch datasets from backend.');
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/activity-log');
      if (res.ok) {
        const data = await res.json();
        setActivityLogs(data.slice(0, 15)); // Get latest 15 logs
      }
    } catch (err) {
      console.warn('Could not fetch activity logs');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a CSV file.');
      return;
    }
    setUploadError('');
    setUploadSuccess('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('dataset_name', datasetName || uploadFile.name);
    formData.append('source', datasetSource || 'Unknown');
    formData.append('description', datasetDesc || 'Imported climate dataset');
    formData.append('user_id', '1'); // Default fallback researcher

    try {
      const res = await fetch('http://localhost:5000/api/datasets/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setUploadSuccess('Dataset uploaded successfully!');
      setDatasetName('');
      setDatasetSource('');
      setDatasetDesc('');
      setUploadFile(null);
      const fileInput = document.getElementById('dataset-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      fetchDatasets();
      fetchLogs();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
    fetchLogs();
  }, []);

  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [currentLoss, setCurrentLoss] = useState<number>(0.68);
  const [currentAccuracy, setCurrentAccuracy] = useState<number>(0.54);
  const [convergenceState, setConvergenceState] = useState<string>('Uninitialized');

  // Chart bar heights
  const [barHeights, setBarHeights] = useState<number[]>([40, 20, 30, 50, 75, 60, 45, 80, 20, 65, 50, 40]);
  const [trainLogs, setTrainLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  const trainingInterval = useRef<any>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [trainLogs]);

  // Handle training loop start/pause
  const handleTrainToggle = () => {
    if (isTraining) {
      clearInterval(trainingInterval.current);
      setIsTraining(false);
      setConvergenceState('Suspended');
    } else {
      setIsTraining(true);
      setConvergenceState('Recurrent Stream');

      // If we are starting from scratch or finished, reset
      if (currentEpoch >= epochs) {
        setCurrentEpoch(0);
        setCurrentLoss(0.68);
        setCurrentAccuracy(0.54);
        setTrainLogs([]);
      }

      trainingInterval.current = setInterval(() => {
        setCurrentEpoch((prevEpoch) => {
          const nextEpoch = prevEpoch + 25; // Speed up UI steps for smoother real-time feel
          if (nextEpoch >= epochs) {
            clearInterval(trainingInterval.current);
            setIsTraining(false);

            // Invoke backend training at completion
            const runBackendTraining = async () => {
              try {
                setTrainLogs((prev) => [...prev, `[INFO] Attempting to log trained model to backend database...`]);
                const res = await fetch('http://localhost:5000/api/models/train', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    dataset_id: selectedDatasetId || 1,
                    algorithm: modelType,
                    epochs: epochs,
                    learning_rate: lr,
                    hidden_layers: hiddenLayers
                  })
                });

                if (!res.ok) {
                  throw new Error('Server returned ' + res.status);
                }

                const data = await res.json();
                setConvergenceState('Optimal (Backend Saved)');
                fetchLogs(); // Refresh activity log table
                setTrainLogs((prev) => [
                  ...prev,
                  `[OK] Model successfully trained on backend via scikit-learn.`,
                  `[OK] Saved model structure to: ${data.model.model_name}`,
                  `[SQL DB] Registered trained model ID: ${data.model.id} into prediction_models table.`,
                  `Final Metrics -> Loss/MAE: ${data.model.metrics.mae.toFixed(4)} | RMSE: ${data.model.metrics.rmse.toFixed(4)} | R² Score: ${data.model.metrics.r2.toFixed(3)}`
                ]);
                setCurrentLoss(parseFloat(data.model.metrics.mae.toFixed(4)));
                setCurrentAccuracy(parseFloat((data.model.metrics.r2).toFixed(3)));
              } catch (err) {
                console.warn('Flask backend training request failed, falling back to local simulation metrics.', err);
                setConvergenceState('Optimal (Simulation)');
                setTrainLogs((prev) => [
                  ...prev,
                  `[WARNING] Flask backend offline at http://localhost:5000. Running local simulation fallback.`,
                  `Epoch ${epochs}/${epochs} [==============================] - loss: 0.041 - val_accuracy: 0.942 - val_mae: 0.038 - Model Converged Successfully.`
                ]);
                setCurrentLoss(0.041);
                setCurrentAccuracy(0.942);
              }
            };
            runBackendTraining();
            return epochs;
          }

          // Compute decay of loss and rise of accuracy dynamically
          const progress = nextEpoch / epochs;
          const decayRate = lr === 0.1 ? 4 : lr === 0.01 ? 2.5 : 1.2;
          const targetLoss = 0.041 + (0.64 * Math.exp(-progress * decayRate));
          const targetAccuracy = 0.942 - (0.4 * Math.exp(-progress * decayRate * 1.2));

          setCurrentLoss(parseFloat(targetLoss.toFixed(4)));
          setCurrentAccuracy(parseFloat(targetAccuracy.toFixed(3)));

          // Add randomized fluctuations to chart heights to simulate neural activities
          setBarHeights((prev) =>
            prev.map((val) => {
              const base = val;
              const delta = (Math.random() - 0.5) * 15;
              return Math.max(15, Math.min(95, base + delta));
            })
          );

          // Add training log metrics
          if (nextEpoch % 25 === 0 || nextEpoch === 5) {
            const val_mae = (targetLoss * 0.92).toFixed(4);
            const val_rmse = (targetLoss * 1.25).toFixed(4);
            setTrainLogs((prev) => [
              ...prev,
              `Epoch ${nextEpoch}/${epochs} - loss: ${targetLoss.toFixed(4)} - val_mae: ${val_mae} - val_rmse: ${val_rmse} - accuracy: ${targetAccuracy.toFixed(3)}`
            ]);
          }

          return nextEpoch;
        });
      }, 80);
    }
  };

  const handleResetTraining = () => {
    clearInterval(trainingInterval.current);
    setIsTraining(false);
    setCurrentEpoch(0);
    setCurrentLoss(0.68);
    setCurrentAccuracy(0.54);
    setConvergenceState('Uninitialized');
    setBarHeights([40, 20, 30, 50, 75, 60, 45, 80, 20, 65, 50, 40]);
    setTrainLogs([]);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => clearInterval(trainingInterval.current);
  }, []);

  return (
    <div id="training-workspace-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Parameter Control */}
      <div className="lg:col-span-4 bg-white border border-outline-variant p-6 rounded shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-primary" />
            <h3 className="font-headline-md text-lg text-primary font-bold">Neural Net Configuration</h3>
          </div>
          <p className="text-xs text-on-surface-variant font-body-sm mb-6">
            Tune neural hyper-parameters to adjust the training optimizer, rate, and model convergence speed.
          </p>

          <div className="space-y-5">
            {/* Dataset Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Training Dataset</label>
              {datasets.length === 0 ? (
                <div className="text-xs bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-550 border-dashed border-slate-300 italic text-slate-500">
                  No datasets found. Upload one below.
                </div>
              ) : (
                <select
                  value={selectedDatasetId || ''}
                  onChange={(e) => setSelectedDatasetId(Number(e.target.value))}
                  disabled={isTraining}
                  title="Select Dataset"
                  className="w-full bg-white border border-outline-variant rounded p-2 text-xs text-slate-700 focus:border-primary cursor-pointer focus:outline-none"
                >
                  {datasets.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.dataset_name} ({d.records_count} rows)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Model Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">AI Layer Architecture</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setModelType('LSTM')}
                  disabled={isTraining}
                  className={`p-2 rounded border text-center transition-all duration-200 cursor-pointer disabled:opacity-50 text-xs font-semibold ${modelType === 'LSTM'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant hover:bg-slate-50 text-slate-600'
                    }`}
                >
                  LSTM (Recurrent)
                </button>
                <button
                  onClick={() => setModelType('ANN')}
                  disabled={isTraining}
                  className={`p-2 rounded border text-center transition-all duration-200 cursor-pointer disabled:opacity-50 text-xs font-semibold ${modelType === 'ANN'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant hover:bg-slate-50 text-slate-600'
                    }`}
                >
                  ANN (Dense Feedforward)
                </button>
              </div>
            </div>

            {/* Learning Rate */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Learning Rate (Optimizer η)</label>
              <select
                value={lr}
                onChange={(e) => setLr(parseFloat(e.target.value))}
                disabled={isTraining}
                className="w-full bg-white border border-outline-variant rounded p-2 text-xs text-slate-700 focus:border-primary cursor-pointer focus:outline-none"
              >
                <option value="0.1">0.1 (Fast, high variance)</option>
                <option value="0.05">0.05 (Aggressive)</option>
                <option value="0.01">0.01 (Standard baseline)</option>
                <option value="0.001">0.001 (Slow, high stability)</option>
              </select>
            </div>

            {/* Target Epochs */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Backpropagation Epochs</label>
                <span className="text-xs font-bold font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                  {epochs} Steps
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={epochs}
                onChange={(e) => setEpochs(parseInt(e.target.value))}
                disabled={isTraining}
                className="w-full accent-primary cursor-pointer disabled:opacity-50"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>100</span>
                <span>500</span>
                <span>1000</span>
              </div>
            </div>

            {/* Layer Depth */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Dense Hidden Layers</label>
              <div className="flex justify-between gap-1">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setHiddenLayers(num)}
                    disabled={isTraining}
                    className={`flex-1 py-1.5 rounded border text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${hiddenLayers === num
                      ? 'bg-primary border-primary text-white'
                      : 'border-outline-variant text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    L-{num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-outline-variant flex gap-3">
          <button
            onClick={handleTrainToggle}
            className={`flex-1 font-label-md text-xs font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer shadow ${isTraining
              ? 'bg-amber-600 text-white hover:brightness-110'
              : 'bg-primary text-white hover:brightness-110'
              }`}
          >
            {isTraining ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Training</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{currentEpoch >= epochs ? 'Retrain Model' : 'Train Model'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetTraining}
            className="bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300 font-label-md text-xs font-bold p-3 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            title="Reset Training State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Training Chart Display */}
      <div className="lg:col-span-8 bg-white border border-outline-variant p-6 rounded shadow-sm flex flex-col justify-between items-stretch">
        <div className="flex justify-between items-center mb-6">
          <span className="font-label-md text-label-md uppercase text-on-surface-variant">Live Training Metrics</span>
          <span className={`font-mono-data text-mono-data flex items-center gap-1.5 font-bold ${isTraining ? 'text-primary animate-pulse' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${isTraining ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            {convergenceState}
          </span>
        </div>

        {/* Dynamic Data Bars Chart */}
        <div className="h-44 flex items-end justify-between space-x-2 border-b border-outline-variant pb-2 relative bg-slate-50/50 p-4 rounded border border-slate-100">
          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-10 p-4">
            <div className="border-b border-slate-700 w-full h-0"></div>
            <div className="border-b border-slate-700 w-full h-0"></div>
            <div className="border-b border-slate-700 w-full h-0"></div>
          </div>

          {barHeights.map((val, idx) => {
            // Replicate specific colors from user image template (mixture of emerald and amber)
            let colorClass = 'bg-[#95d3ba]'; // primary-fixed-dim
            if (idx === 4 || idx === 7) colorClass = 'bg-[#fe932c]'; // secondary-container / orange
            else if (idx % 2 === 0) colorClass = 'bg-[#003527]'; // primary emerald

            return (
              <div
                key={idx}
                className={`${colorClass} rounded-t-sm transition-all duration-300 flex-1`}
                style={{ height: `${val}%` }}
              ></div>
            );
          })}
        </div>

        {/* Epoch metrics stats */}
        <div className="mt-4 pt-2 flex justify-between gap-4 border-b border-outline-variant/30 pb-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Epoch Timeline</span>
            <span className="font-headline-md text-xl text-primary font-mono-data">
              {currentEpoch} <span className="text-xs text-slate-400">/ {epochs}</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-500" /> Training Loss
            </span>
            <span className="font-headline-md text-xl text-primary font-mono-data">
              {currentLoss.toFixed(4)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-500" /> Accuracy Index
            </span>
            <span className="font-headline-md text-xl text-primary font-mono-data">
              {currentAccuracy.toFixed(3)}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Convergence Status</span>
            <span className={`font-headline-md text-xl font-bold ${currentEpoch >= epochs ? 'text-[#fe932c]' : 'text-primary'}`}>
              {currentEpoch >= epochs ? 'Optimal' : isTraining ? 'Active' : 'Uninitialized'}
            </span>
          </div>
        </div>

        {/* Backpropagation matrix logs terminal */}
        <div className="mt-4 flex-1">
          <h5 className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-2">Backpropagation Feed Output</h5>
          <div className="bg-[#0f172a] text-slate-300 font-mono text-[11px] p-3.5 rounded border border-slate-800 h-28 overflow-y-auto space-y-1 scrollbar-none">
            {trainLogs.length === 0 ? (
              <div className="text-slate-500 italic">No backpropagation stream logs compiled. Click 'Train Model' to load.</div>
            ) : (
              trainLogs.map((log, i) => (
                <div key={i} className="font-mono leading-relaxed text-emerald-400/90 flex gap-2">
                  <span className="text-slate-600 select-none font-mono">[{i}]</span>
                  <span className="font-mono">{log}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {/* Bottom Section: Upload & Database Logs Management */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t border-slate-100 pt-8">

        {/* Upload Panel */}
        <div className="bg-white border border-outline-variant p-6 rounded shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-headline-md text-base text-[#003527] font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Dataset CSV Uploader
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Register localized Eco-zone parameters to train prediction neural nets. Upload a CSV spreadsheet containing columns: <strong>year, temp, rain, anomaly</strong>. If mismatched, the server falls back to synthetic dataset generation.
            </p>

            {uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-650 text-xs p-3 rounded font-semibold text-red-600 animate-shake">
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs p-3 rounded font-semibold border-emerald-200 animate-fade-in">
                {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Dataset Name</label>
                  <input
                    type="text"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="e.g. Niger Delta 2026 Raw"
                    className="w-full border border-slate-200 rounded p-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Data Source</label>
                  <input
                    type="text"
                    value={datasetSource}
                    onChange={(e) => setDatasetSource(e.target.value)}
                    placeholder="e.g. NOAA GCN / ECOWAS"
                    className="w-full border border-slate-200 rounded p-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Dataset Details/Description</label>
                <textarea
                  value={datasetDesc}
                  onChange={(e) => setDatasetDesc(e.target.value)}
                  placeholder="Summarize decadal intervals or regional variables..."
                  rows={2}
                  className="w-full border border-slate-200 rounded p-2 text-xs focus:border-primary focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Select CSV Spreadsheet</label>
                <input
                  id="dataset-file-input"
                  type="file"
                  accept=".csv"
                  required
                  title="Select CSV Spreadsheet"
                  placeholder="Upload CSV"
                  onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#003527] hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-[#003527] hover:bg-[#002219] text-white font-bold text-xs uppercase py-3 rounded shadow transition-all cursor-pointer disabled:opacity-50 mt-4 flex items-center justify-center space-x-1"
              >
                <span>{isUploading ? 'Uploading Dataset...' : 'Register Dataset to SQL DB'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Activity Logs Table */}
        <div className="bg-white border border-outline-variant p-6 rounded shadow-sm flex flex-col justify-between">
          <div className="space-y-4 flex-1 flex flex-col">
            <h4 className="font-headline-md text-base text-[#003527] font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              System Activity Logs
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Audit logs detailing user transactions committed to SQLite database (`database.db`).
            </p>

            <div className="overflow-y-auto max-h-[220px] border border-outline-variant/30 rounded flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-outline-variant/30 text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="py-2.5 px-3">Date/Time</th>
                    <th className="py-2.5 px-3">Action Completed</th>
                    <th className="py-2.5 px-3 text-right">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-[10px] text-slate-600 font-mono">
                  {activityLogs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-400 italic">No activity logs recorded in database.</td>
                    </tr>
                  ) : (
                    activityLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                          {new Date(log.activity_date).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 font-semibold text-[#003527]">
                          {log.activity}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-400 font-mono">
                          {log.ip_address || '127.0.0.1'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
