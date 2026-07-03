/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required for live AI forecasts.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Fallback mechanical/scientific prediction calculator
function calculateFallbackPrediction(
  countryName: string,
  baselineTemp: number,
  baselineRain: number,
  year: number,
  scenario: 'low' | 'moderate' | 'extreme',
  reforestation: number,
  urbanization: number
) {
  const yearsAhead = year - 2026;
  
  // Base warming rate
  let warmingRate = 0.035; // °C per year
  if (scenario === 'low') warmingRate = 0.015;
  if (scenario === 'extreme') warmingRate = 0.055;

  // Modifiers
  const reforestEffect = (reforestation / 100) * 0.008; // lowers warming rate
  const urbanEffect = (urbanization / 100) * 0.005; // increases warming rate
  
  const effectiveWarmingRate = Math.max(0.005, warmingRate - reforestEffect + urbanEffect);
  const tempAnomaly = parseFloat((yearsAhead * effectiveWarmingRate).toFixed(2));

  // Precipitation shift
  let baseRainShift = -0.15; // % change per year
  if (scenario === 'low') baseRainShift = -0.05;
  if (scenario === 'extreme') baseRainShift = -0.35;

  // Reforestation brings more rainfall
  const reforestRainEffect = (reforestation / 100) * 0.15;
  const effectiveRainShiftRate = baseRainShift + reforestRainEffect;
  const rainShift = parseFloat((yearsAhead * effectiveRainShiftRate).toFixed(1));

  // Risk categorization
  let riskCategory: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Moderate';
  const totalWarming = tempAnomaly;
  if (totalWarming < 0.8) riskCategory = 'Low';
  else if (totalWarming < 1.6) riskCategory = 'Moderate';
  else if (totalWarming < 2.5) riskCategory = 'High';
  else riskCategory = 'Critical';

  // Industry commentaries
  const analysis = `Fallback scientific model projections for ${countryName} under a ${scenario}-emission path. By ${year}, temperatures are modeled to deviate by +${tempAnomaly}°C. Rainfall variability shifts by ${rainShift}%. Local vegetative shields (Forestation at ${reforestation}%) provide micro-climate buffers, while Urbanization (${urbanization}%) drives regional heat-island impacts.`;

  const recommendations = [
    'Implement micro-drip agricultural systems to preserve soil moisture under declining rainfall.',
    'Formulate community-level climate adaptation plans for vulnerable rain-fed smallholders.',
    'Construct dual-purpose stormwater drainage corridors in urban hubs to prevent sudden flash flooding.',
    'Scale up mangrove restoration or vegetative seawalls to protect critical low-elevation coastal zones.'
  ];

  const sectorImpacts = {
    agriculture: `Reduction in maize/cocoa yields by an estimated ${Math.abs(Math.round(rainShift * 1.2))}% due to moisture deficits. Crop cycle durations will likely shorten.`,
    water: `Groundwater recharge levels are expected to drop by ${(Math.abs(rainShift) + 2).toFixed(1)}%, triggering localized reservoir stresses.`,
    coastal: `Increased coastal zone high-tide intrusions. Low-lying mudflats face salinization, impacting local rice cultivators.`,
    health: `Elevated daily heat-stress indices. Heatwave durations are expected to multiply by ${Math.round(tempAnomaly * 1.5) || 1}x, increasing vulnerable population risks.`
  };

  return {
    tempAnomaly,
    rainShift,
    riskCategory,
    analysis,
    recommendations,
    sectorImpacts,
    confidence: 88,
  };
}

// API endpoint for climate prediction
app.post('/api/predict', async (req, res) => {
  try {
    const { countryId, countryName, baselineTemp, baselineRain, year, scenario, reforestation, urbanizationRate } = req.body;

    if (!countryId || !year || !scenario) {
      return res.status(400).json({ error: 'Missing required prediction parameters.' });
    }

    // Try to use Gemini client
    try {
      const ai = getGeminiClient();
      
      const prompt = `
        You are a highly advanced West African climate forecasting AI.
        Compute a scientifically grounded climate change prediction for ${countryName} for the year ${year}.
        
        Parameters:
        - Country: ${countryName} (historical baseline temp: ${baselineTemp}°C, baseline rain: ${baselineRain}mm/year)
        - Forecast Year: ${year}
        - Emission Path Scenario: ${scenario} (representing IPCC climate pathways)
        - Local Reforestation level: ${reforestation}%
        - Local Urbanization rate: ${urbanizationRate}%
        
        Using these factors, generate a realistic climate model prediction. Return your response in JSON format matching this schema:
        {
          "tempAnomaly": <number representing temperature anomaly in °C, e.g. 1.85>,
          "rainShift": <number representing percentage precipitation shift, e.g. -8.4>,
          "riskCategory": <string, one of: "Low", "Moderate", "High", "Critical">,
          "analysis": <string, detailed climate narrative summarizing the eco-climatic outlook, 2-3 sentences>,
          "recommendations": [<array of 3-4 highly specific, actionable climate adaptation strategies for West Africa>],
          "sectorImpacts": {
            "agriculture": <string, specific impact on rain-fed crops or farming>,
            "water": <string, impact on river basins, aquifers, or domestic reservoirs>,
            "coastal": <string, coastal erosion or sea-level impact>,
            "health": <string, heat stress or vector-borne disease impact>
          },
          "confidence": <integer representing forecast confidence percentage, e.g. 92>
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tempAnomaly: { type: Type.NUMBER, description: 'Temperature anomaly in °C from current baselines' },
              rainShift: { type: Type.NUMBER, description: 'Percentage change in precipitation volume' },
              riskCategory: { type: Type.STRING, description: 'Overall risk level: Low, Moderate, High, Critical' },
              analysis: { type: Type.STRING, description: 'Detailed climate analysis narrative' },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 to 4 actionable, localized adaptation strategies'
              },
              sectorImpacts: {
                type: Type.OBJECT,
                properties: {
                  agriculture: { type: Type.STRING },
                  water: { type: Type.STRING },
                  coastal: { type: Type.STRING },
                  health: { type: Type.STRING }
                },
                required: ['agriculture', 'water', 'coastal', 'health']
              },
              confidence: { type: Type.INTEGER, description: 'Confidence level percentage from 50 to 98' }
            },
            required: ['tempAnomaly', 'rainShift', 'riskCategory', 'analysis', 'recommendations', 'sectorImpacts', 'confidence']
          }
        }
      });

      const responseText = response.text || '';
      const prediction = JSON.parse(responseText.trim());
      
      return res.json({
        countryId,
        countryName,
        year,
        scenario,
        timestamp: new Date().toISOString(),
        ...prediction
      });

    } catch (aiError: any) {
      // Log the warning but don't fail, use the scientific fallback model!
      console.warn('Gemini prediction client warning:', aiError.message);
      
      const fallback = calculateFallbackPrediction(
        countryName,
        baselineTemp,
        baselineRain,
        year,
        scenario,
        reforestation,
        urbanizationRate
      );

      return res.json({
        countryId,
        countryName,
        year,
        scenario,
        timestamp: new Date().toISOString(),
        ...fallback,
        note: 'Calculated using baseline mathematical climate modeling (Offline Mode)'
      });
    }

  } catch (error: any) {
    console.error('Core forecasting endpoint error:', error);
    res.status(500).json({ error: 'An internal error occurred during prediction generation.' });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[West African Climate AI Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
