// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import React from 'react';
// import { BookOpen, Award, BarChart3, Binary, Compass, Cpu, FileText } from 'lucide-react';

// export default function MethodologyPanel() {
//   return (
//     <div id="methodology-panel-workspace" className="space-y-8 max-w-5xl mx-auto">
//       {/* Introduction Card */}
//       <div className="bg-white border border-outline-variant rounded p-6 shadow-sm">
//         <div className="flex items-center gap-3 mb-4">
//           <BookOpen className="w-6 h-6 text-primary" />
//           <h3 className="font-headline-lg text-2xl text-primary font-bold">Research Methodology & Mathematical Framework</h3>
//         </div>
//         <p className="text-sm text-on-surface-variant leading-relaxed">
//           The West African Climate AI portal integrates state-of-the-art machine learning (ML) architectures with high-fidelity GIS raster layers. Under Department of Computer Science supervision, the forecasting engine processes multi-decadal historical climate datasets from NOAA, the IPCC AR6, and localized ECOWAS weather stations.
//         </p>
//       </div>

//       {/* Grid of details */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Deep Learning Architectures */}
//         <div className="bg-white border border-outline-variant rounded p-6 shadow-sm">
//           <h4 className="font-headline-md text-lg text-primary font-bold mb-3 flex items-center gap-2">
//             <Cpu className="w-5 h-5 text-primary" />
//             1. Predictive Machine Learning Layers
//           </h4>
//           <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
//             <p>
//               The primary computational core comprises two distinct forecasting models designed for temporal sequence predictions:
//             </p>
//             <ul className="space-y-2 list-disc list-inside">
//               <li>
//                 <strong className="text-primary">Sequential Recurrent neural networks (LSTM):</strong> Processes sequential multi-layered meteorological time-series records. The gate controls (input, forget, output) mitigate exploding gradient problems across 50-year forecasting spans.
//               </li>
//               <li>
//                 <strong className="text-primary">Artificial Neural Networks (ANN):</strong> Standard multi-layered dense network utilized for backpropagating localized parameters (urbanization, reforestation offsets) into boundary matrices.
//               </li>
//             </ul>
//             <p>
//               Optimizer weight tuning is conducted via the <strong>Adam (Adaptive Moment Estimation)</strong> stochastic algorithm, utilizing running averages of both the gradients and the second raw moments.
//             </p>
//           </div>
//         </div>

//         {/* GIS Integration */}
//         <div className="bg-white border border-outline-variant rounded p-6 shadow-sm">
//           <h4 className="font-headline-md text-lg text-primary font-bold mb-3 flex items-center gap-2">
//             <Compass className="w-5 h-5 text-primary" />
//             2. GIS Raster-to-Vector Normalization
//           </h4>
//           <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
//             <p>
//               Historical raw spatial datasets exist as continuous grid cells (Raster matrices). To match political ECOWAS borders, we implement structural raster-to-vector aggregation:
//             </p>
//             <div className="bg-slate-50 border border-slate-200 rounded p-3 font-mono leading-relaxed text-[11px] text-slate-700">
//               <span className="font-bold text-primary font-mono">Aggregation Formula:</span>
//               <div className="my-1 text-center font-mono font-bold">
//                 V_vector = (1 / N) * ∑ (R_ij * W_ij)
//               </div>
//               <p className="text-[10px] text-slate-500 font-mono mt-2 leading-normal">
//                 Where N is cell count, R_ij represents raw coordinate values, and W_ij is spatial weight multipliers mapped to ECOWAS polygons.
//               </p>
//             </div>
//             <p>
//               Grid layers are normalized between [0, 1] using standard min-max range matrices before dense layer feeding, maintaining numerical accuracy.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Accuracy assessment mathematical frameworks */}
//       <div className="bg-white border border-outline-variant rounded p-6 shadow-sm">
//         <h4 className="font-headline-md text-lg text-primary font-bold mb-4 flex items-center gap-2">
//           <Award className="w-5 h-5 text-primary" />
//           3. Accuracy Assessment & Optimization Metrics
//         </h4>
//         <p className="text-xs text-slate-500 leading-relaxed mb-6">
//           Forecasting performance is iteratively measured using three standardized statistical parameters calculated over training validations.
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* MAE */}
//           <div className="border border-outline-variant/50 rounded p-4 bg-slate-50">
//             <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Mean Absolute Error (MAE)</h5>
//             <div className="font-mono font-bold text-slate-700 text-center text-sm py-3 border-b border-dashed border-slate-200 mb-3">
//               MAE = (1 / n) * ∑ |y_i - ŷ_i|
//             </div>
//             <p className="text-[11px] text-slate-500 leading-relaxed">
//               Calculates the mean magnitude of prediction errors without considering their direction, assessing general operational deviation.
//             </p>
//           </div>

//           {/* RMSE */}
//           <div className="border border-outline-variant/50 rounded p-4 bg-slate-50">
//             <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Root Mean Squared Error (RMSE)</h5>
//             <div className="font-mono font-bold text-slate-700 text-center text-sm py-3 border-b border-dashed border-slate-200 mb-3">
//               RMSE = √[ (1 / n) * ∑ (y_i - ŷ_i)² ]
//             </div>
//             <p className="text-[11px] text-slate-500 leading-relaxed">
//               Measures error variance by penalizing larger outliers more heavily, indicating critical threshold prediction errors.
//             </p>
//           </div>

//           {/* R2 */}
//           <div className="border border-outline-variant/50 rounded p-4 bg-slate-50">
//             <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Coefficient of Determination (R²)</h5>
//             <div className="font-mono font-bold text-slate-700 text-center text-sm py-3 border-b border-dashed border-slate-200 mb-3">
//               R² = 1 - [ ∑(y_i - ŷ_i)² / ∑(y_i - ȳ)² ]
//             </div>
//             <p className="text-[11px] text-slate-500 leading-relaxed">
//               Represents the proportion of variance in meteorological outputs predictable from the input parameters.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Citations & Publications references */}
//       <div className="bg-slate-50 border border-slate-200 rounded p-6">
//         <h4 className="font-headline-md text-base text-primary font-bold mb-3 flex items-center gap-2">
//           <FileText className="w-4 h-4 text-primary" />
//           Academic Reference bibliography
//         </h4>
//         <ul className="space-y-3.5 text-xs text-slate-500 leading-relaxed list-decimal list-inside">
//           <li>
//             IPCC, 2023: Climate Change 2023: Synthesis Report. Contribution of Working Groups I, II and III to the Sixth Assessment Report of the Intergovernmental Panel on Climate Change. Geneva, Switzerland.
//           </li>
//           <li>
//             ECOWAS Centre for Renewable Energy and Energy Efficiency (ECREEE), 2024: West African Meteorological Adaptation Atlas & GIS Datasets. Praia, Cabo Verde.
//           </li>
//           <li>
//             Okafor, C. D., 2026: <i>Recurrent Neural Networks for Predictive Multi-Layered Temperature Anomalies in West African Eco-zones.</i> Department of Computer Science. Matric No: U2022/5570029.
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }
