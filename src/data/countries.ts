/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country, HistoricalRecord } from '../types';

export const COUNTRIES: Country[] = [
  {
    id: 'nigeria',
    name: 'Nigeria',
    code: 'NG',
    baselineTemp: 26.8,
    baselineRain: 1150,
    riskScore: 78,
    ecoZone: 'Guinean Forest / Sudan Savanna',
    vulnerabilityIndex: 0.72,
    description: 'High agricultural dependence. Suffers coastal flooding in Lagos/Delta and desertification in the north.',
    coordinates: {
      x: 380,
      y: 220,
      path: 'M 350,160 L 400,160 L 450,180 L 450,260 L 380,270 L 350,250 L 330,220 Z'
    }
  },
  {
    id: 'ghana',
    name: 'Ghana',
    code: 'GH',
    baselineTemp: 27.2,
    baselineRain: 1200,
    riskScore: 62,
    ecoZone: 'Guinean Forest-Savanna',
    vulnerabilityIndex: 0.58,
    description: 'Vulnerable coastal fisheries and rain-fed cocoa farming sectors under shifts in rainfall timing.',
    coordinates: {
      x: 255,
      y: 230,
      path: 'M 250,180 L 270,180 L 270,250 L 245,250 L 245,210 Z'
    }
  },
  {
    id: 'senegal',
    name: 'Senegal',
    code: 'SN',
    baselineTemp: 28.5,
    baselineRain: 550,
    riskScore: 74,
    ecoZone: 'Sahelian Arid Grassland',
    vulnerabilityIndex: 0.69,
    description: 'Prone to severe droughts, sea-level rise affecting Dakar, and salinization of arable delta lands.',
    coordinates: {
      x: 75,
      y: 130,
      path: 'M 60,110 L 95,110 L 105,130 L 95,160 L 65,150 L 55,130 Z'
    }
  },
  {
    id: 'mali',
    name: 'Mali',
    code: 'ML',
    baselineTemp: 28.8,
    baselineRain: 440,
    riskScore: 85,
    ecoZone: 'Sahelian / Sahara Desert',
    vulnerabilityIndex: 0.84,
    description: 'Landlocked nation facing accelerating Sahara desertification, heatwaves, and critical river flow reductions.',
    coordinates: {
      x: 180,
      y: 120,
      path: 'M 105,130 L 170,100 L 240,60 L 260,110 L 220,180 L 160,180 L 140,160 Z'
    }
  },
  {
    id: 'niger',
    name: 'Niger',
    code: 'NE',
    baselineTemp: 27.9,
    baselineRain: 280,
    riskScore: 89,
    ecoZone: 'Sahara Desert / Sahel',
    vulnerabilityIndex: 0.88,
    description: 'Extreme heat vulnerability and severe food security risks due to critical dependence on sparse, irregular rains.',
    coordinates: {
      x: 350,
      y: 110,
      path: 'M 260,110 L 330,110 L 430,90 L 450,140 L 350,160 L 260,150 Z'
    }
  },
  {
    id: 'burkina_faso',
    name: 'Burkina Faso',
    code: 'BF',
    baselineTemp: 28.2,
    baselineRain: 700,
    riskScore: 72,
    ecoZone: 'Sudan-Sahelian Savanna',
    vulnerabilityIndex: 0.76,
    description: 'Subject to sudden, intense floods interspaced with multi-year groundwater shortages and soil erosion.',
    coordinates: {
      x: 230,
      y: 175,
      path: 'M 200,165 L 255,155 L 270,180 L 220,195 L 200,185 Z'
    }
  },
  {
    id: 'ivory_coast',
    name: "Côte d'Ivoire",
    code: 'CI',
    baselineTemp: 26.3,
    baselineRain: 1400,
    riskScore: 58,
    ecoZone: 'Guinean Moist Forest',
    vulnerabilityIndex: 0.54,
    description: 'World leading cocoa producer facing challenges as thermal envelopes push growing regions to higher altitudes.',
    coordinates: {
      x: 195,
      y: 230,
      path: 'M 175,185 L 205,185 L 245,210 L 240,250 L 185,245 Z'
    }
  },
  {
    id: 'guinea',
    name: 'Guinea',
    code: 'GN',
    baselineTemp: 25.8,
    baselineRain: 1650,
    riskScore: 65,
    ecoZone: 'Fouta Djallon Highlands',
    vulnerabilityIndex: 0.64,
    description: 'Known as West Africa\'s "water tower." Highland temperature shifts impact downstream rivers (Niger, Senegal).',
    coordinates: {
      x: 110,
      y: 185,
      path: 'M 105,150 L 140,160 L 175,185 L 155,215 L 120,210 L 95,180 Z'
    }
  }
];

export const HISTORICAL_DATA: Record<string, HistoricalRecord[]> = {
  nigeria: [
    { year: 1980, temp: 26.1, rain: 1220, anomaly: -0.7 },
    { year: 1985, temp: 26.3, rain: 1180, anomaly: -0.5 },
    { year: 1990, temp: 26.5, rain: 1160, anomaly: -0.3 },
    { year: 1995, temp: 26.7, rain: 1140, anomaly: -0.1 },
    { year: 2000, temp: 26.8, rain: 1150, anomaly: 0.0 },
    { year: 2005, temp: 27.1, rain: 1110, anomaly: 0.3 },
    { year: 2010, temp: 27.3, rain: 1090, anomaly: 0.5 },
    { year: 2015, temp: 27.5, rain: 1070, anomaly: 0.7 },
    { year: 2020, temp: 27.8, rain: 1040, anomaly: 1.0 },
    { year: 2025, temp: 28.1, rain: 1020, anomaly: 1.3 }
  ],
  ghana: [
    { year: 1980, temp: 26.5, rain: 1280, anomaly: -0.7 },
    { year: 1985, temp: 26.8, rain: 1250, anomaly: -0.4 },
    { year: 1990, temp: 27.0, rain: 1210, anomaly: -0.2 },
    { year: 1995, temp: 27.1, rain: 1200, anomaly: -0.1 },
    { year: 2000, temp: 27.2, rain: 1200, anomaly: 0.0 },
    { year: 2005, temp: 27.4, rain: 1170, anomaly: 0.2 },
    { year: 2010, temp: 27.6, rain: 1150, anomaly: 0.4 },
    { year: 2015, temp: 27.8, rain: 1120, anomaly: 0.6 },
    { year: 2020, temp: 28.1, rain: 1090, anomaly: 0.9 },
    { year: 2025, temp: 28.4, rain: 1060, anomaly: 1.2 }
  ],
  senegal: [
    { year: 1980, temp: 27.7, rain: 610, anomaly: -0.8 },
    { year: 1985, temp: 27.9, rain: 580, anomaly: -0.6 },
    { year: 1990, temp: 28.2, rain: 560, anomaly: -0.3 },
    { year: 1995, temp: 28.4, rain: 540, anomaly: -0.1 },
    { year: 2000, temp: 28.5, rain: 550, anomaly: 0.0 },
    { year: 2005, temp: 28.8, rain: 520, anomaly: 0.3 },
    { year: 2010, temp: 29.1, rain: 500, anomaly: 0.6 },
    { year: 2015, temp: 29.3, rain: 480, anomaly: 0.8 },
    { year: 2020, temp: 29.6, rain: 460, anomaly: 1.1 },
    { year: 2025, temp: 30.0, rain: 430, anomaly: 1.5 }
  ],
  mali: [
    { year: 1980, temp: 28.0, rain: 500, anomaly: -0.8 },
    { year: 1985, temp: 28.2, rain: 470, anomaly: -0.6 },
    { year: 1990, temp: 28.5, rain: 450, anomaly: -0.3 },
    { year: 1995, temp: 28.7, rain: 440, anomaly: -0.1 },
    { year: 2000, temp: 28.8, rain: 440, anomaly: 0.0 },
    { year: 2005, temp: 29.2, rain: 410, anomaly: 0.4 },
    { year: 2010, temp: 29.5, rain: 390, anomaly: 0.7 },
    { year: 2015, temp: 29.8, rain: 370, anomaly: 1.0 },
    { year: 2020, temp: 30.1, rain: 350, anomaly: 1.3 },
    { year: 2025, temp: 30.5, rain: 320, anomaly: 1.7 }
  ],
  niger: [
    { year: 1980, temp: 27.1, rain: 330, anomaly: -0.8 },
    { year: 1985, temp: 27.3, rain: 310, anomaly: -0.6 },
    { year: 1990, temp: 27.6, rain: 290, anomaly: -0.3 },
    { year: 1995, temp: 27.8, rain: 280, anomaly: -0.1 },
    { year: 2000, temp: 27.9, rain: 280, anomaly: 0.0 },
    { year: 2005, temp: 28.3, rain: 260, anomaly: 0.4 },
    { year: 2010, temp: 28.6, rain: 240, anomaly: 0.7 },
    { year: 2015, temp: 28.9, rain: 220, anomaly: 1.0 },
    { year: 2020, temp: 29.2, rain: 200, anomaly: 1.3 },
    { year: 2025, temp: 29.6, rain: 180, anomaly: 1.7 }
  ],
  burkina_faso: [
    { year: 1980, temp: 27.4, rain: 760, anomaly: -0.8 },
    { year: 1985, temp: 27.6, rain: 730, anomaly: -0.6 },
    { year: 1990, temp: 27.9, rain: 710, anomaly: -0.3 },
    { year: 1995, temp: 28.1, rain: 700, anomaly: -0.1 },
    { year: 2000, temp: 28.2, rain: 700, anomaly: 0.0 },
    { year: 2005, temp: 28.5, rain: 670, anomaly: 0.3 },
    { year: 2010, temp: 28.8, rain: 650, anomaly: 0.6 },
    { year: 2015, temp: 29.1, rain: 620, anomaly: 0.9 },
    { year: 2020, temp: 29.4, rain: 600, anomaly: 1.2 },
    { year: 2025, temp: 29.8, rain: 570, anomaly: 1.6 }
  ],
  ivory_coast: [
    { year: 1980, temp: 25.6, rain: 1480, anomaly: -0.7 },
    { year: 1985, temp: 25.8, rain: 1450, anomaly: -0.5 },
    { year: 1990, temp: 26.0, rain: 1420, anomaly: -0.3 },
    { year: 1995, temp: 26.2, rain: 1410, anomaly: -0.1 },
    { year: 2000, temp: 26.3, rain: 1400, anomaly: 0.0 },
    { year: 2005, temp: 26.5, rain: 1380, anomaly: 0.2 },
    { year: 2010, temp: 26.7, rain: 1360, anomaly: 0.4 },
    { year: 2015, temp: 27.0, rain: 1330, anomaly: 0.7 },
    { year: 2020, temp: 27.3, rain: 1300, anomaly: 1.0 },
    { year: 2025, temp: 27.6, rain: 1260, anomaly: 1.3 }
  ],
  guinea: [
    { year: 1980, temp: 25.1, rain: 1730, anomaly: -0.7 },
    { year: 1985, temp: 25.3, rain: 1700, anomaly: -0.5 },
    { year: 1990, temp: 25.5, rain: 1670, anomaly: -0.3 },
    { year: 1995, temp: 25.7, rain: 1660, anomaly: -0.1 },
    { year: 2000, temp: 25.8, rain: 1650, anomaly: 0.0 },
    { year: 2005, temp: 26.1, rain: 1620, anomaly: 0.3 },
    { year: 2010, temp: 26.3, rain: 1590, anomaly: 0.5 },
    { year: 2015, temp: 26.6, rain: 1560, anomaly: 0.8 },
    { year: 2020, temp: 26.9, rain: 1520, anomaly: 1.1 },
    { year: 2025, temp: 27.2, rain: 1480, anomaly: 1.4 }
  ]
};
