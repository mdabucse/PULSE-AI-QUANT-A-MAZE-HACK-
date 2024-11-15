import express from 'express';
import cors from 'cors'; 
import fs from 'fs/promises';
import path from 'path';
import { makeCall } from './sos.js';

const app = express();
const PORT = 5000;

app.use(cors());

const readFileContent = async (fileName) => {
    try {
        const filePath = path.join('A:', 'Projects', 'Vital Monitoring', 'From_Scratch', 'model', 'data', fileName);
        console.log(`Reading file from absolute path: ${filePath}`);
        const content = await fs.readFile(filePath, 'utf-8');

        if (fileName === 'skin_tone_data.txt') {
            const skinToneMatch = content.match(/Skin Tone:\s*([a-zA-Z]+)/);
            const skinToneDescription = skinToneMatch ? skinToneMatch[1] : 'Unknown';

            const colorMatch = content.match(/Average Skin Color \(BGR\):\s*\[([0-9]+),\s*([0-9]+),\s*([0-9]+)\]/);
            if (colorMatch) {
                const [b, g, r] = colorMatch.slice(1).map(Number);  
                return { color: `rgb(${r}, ${g}, ${b})`, skinToneDescription }; 
            }
        }

        return content.trim();
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error);
        return null;
    }
};

app.get('/api/metrics', async (req, res) => {
    try {
        const heartRate = await readFileContent('bpm_data.txt');
        const spo2 = await readFileContent('temperature.txt');
        const sleepRate = await readFileContent('sleep_data.txt');
        
        // Fetch skin tone and baby color
        const skinToneData = await readFileContent('skin_tone_data.txt');
        const babyColor = skinToneData.color || '#fff';
        const skinTone = skinToneData.skinToneDescription || 'Unknown';
        const  apgarSummary = await readFileContent('apgar_summary.txt');
        res.json({
            heartRate: parseInt(heartRate, 10) || 0,
            spo2: parseFloat(spo2),
            sleepRate: sleepRate || '00:00',
            babyColor,
            skinTone,
            apgarSummary,
            lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Failed to retrieve metrics' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Vital Monitoring API! Access /api/metrics for metrics data.');
});

app.get('/api/sos', async (req, res) => {
    try {
      const callSid = await makeCall();
      res.status(200).json({ success: true, message: 'SOS call initiated successfully.', callSid });
    } catch (error) {
      console.error('Error initiating SOS call:', error);
      res.status(500).json({ success: false, message: 'Failed to initiate SOS call.' });
    }
  });


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
