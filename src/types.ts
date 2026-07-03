/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Country {
  id: string;
  name: string;
  code: string;
  baselineTemp: number; // °C
  baselineRain: number; // mm/year
  riskScore: number; // 0-100
  ecoZone: string;
  vulnerabilityIndex: number; // 0.0 to 1.0
  description: string;
  coordinates: { x: number; y: number; path: string }; // SVG map path coordinates
}

export type EmissionScenario = 'low' | 'moderate' | 'extreme';

export interface PredictionParameters {
  countryId: string;
  year: number;
  scenario: EmissionScenario;
  reforestation: number; // 0-100%
  urbanizationRate: number; // 0-100%
}

export interface SectorImpacts {
  agriculture: string;
  water: string;
  coastal: string;
  health: string;
}

export interface PredictionResult {
  countryId: string;
  countryName: string;
  year: number;
  scenario: EmissionScenario;
  tempAnomaly: number; // °C anomaly (e.g. +2.4)
  rainShift: number; // % change (e.g. -12)
  riskCategory: 'Low' | 'Moderate' | 'High' | 'Critical';
  analysis: string;
  recommendations: string[];
  sectorImpacts: SectorImpacts;
  confidence: number; // % (e.g. 92)
  timestamp: string;
}

export interface AlertFeedItem {
  id: string;
  region: string;
  message: string;
  severity: 'warning' | 'critical' | 'info';
  timestamp: string;
}

export interface TrainingConfig {
  learningRate: number;
  epochs: number;
  modelType: 'ANN' | 'LSTM' | 'Linear';
  hiddenLayers: number;
}

export interface HistoricalRecord {
  year: number;
  temp: number; // °C
  rain: number; // mm
  anomaly: number; // °C from historical mean
}
