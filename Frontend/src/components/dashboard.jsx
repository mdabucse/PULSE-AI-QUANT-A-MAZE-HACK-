import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import './dashboard.css';
import heart from '../assets/heart.png';
import lung from '../assets/lung.png';
import emgy from '../assets/emgy.jpg';
import sleep1 from '../assets/sleep1.png';
import logo from '../assets/logo.png';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
   const [metrics, setMetrics] = useState({
      heartRate: 0,
      spo2: 0.0,
      sleepRate: '00:00',
      babyColor: '#fff',
      skinTone: 'Unknown',
      lastUpdated: 'N/A',
      apgarSummary: 'Loading health status...'
   });

   const [heartRateHistory, setHeartRateHistory] = useState([]);

   useEffect(() => {
      const fetchMetrics = async () => {
         try {
            const response = await fetch('http://localhost:5000/api/metrics');
            const data = await response.json();
            setMetrics(data);
            setHeartRateHistory((prevHistory) => [...prevHistory.slice(-20), data.heartRate]);
         } catch (error) {
            console.error('Error fetching metrics:', error);
         }
      };

      const intervalId = setInterval(fetchMetrics, 5000);

      return () => clearInterval(intervalId);
   }, []);

   const heartRateData = {
      labels: heartRateHistory.map((_, index) => index),
      datasets: [
         {
            label: 'Heart Rate',
            data: heartRateHistory,
            fill: false,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
         },
      ],
   };

   const handleSosClick = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sos', { method: 'GET' });
        const data = await response.json();
        if (data.success) {
          alert('SOS call initiated successfully.');
        } else {
          alert(`Failed to initiate SOS call. Reason: ${data.message}`);
        }
      } catch (error) {
        console.error('Error initiating SOS call:', error);
        alert('An error occurred while initiating the SOS call.');
      }
    };
    

   return (
      <div className="dashboard">
         <header className="header">
            <div className="logo">
               <img src={logo} alt="Pulse AI Logo" className="logo-icon" />
               <h1>PULSE AI</h1>
            </div>
            <button className="export-btn">Export</button>
         </header>

         <div className="dashboard-content">
            <div className="video-feed">
               <img
                    src="http://localhost:8000/video_feed" 
                    alt="Live Video Feed"
                    className="video-stream"
                    style={{ width: '100%', height: 'auto' }}
                />
               <div className="video-label">baby 0.81</div>
            </div>

            <div className='main ob'>
               <div className='observes1'>
                  <div className="metric-card">
                     <p className='metric-head-heart'>Heart Rate</p>
                     <div className='heart-metrics'>
                     <img src={heart} alt="Heart Icon" className="metric-icon1" />
                     <div className="heart-rate-chart">
                      <Line data={heartRateData} />
                     </div>
                     </div>
                     <p className="metric-value1">{metrics.heartRate} <span>BPM</span></p>
                  </div>

                  <div className="metric-card baby-color">
                     <p className="metric-head-color">Baby Color</p>
                     <div className="color-display" style={{ backgroundColor: metrics.babyColor }}></div>
                     <p className="skin-tone">Skin Tone: {metrics.skinTone}</p> 
                  </div>

            </div>

               <div className='observes2'>
                  <div className="metric-card1">
                     <p className='metric-head'>Sleep Rate</p>
                     <div className='sleep-metrics'>
                     <img src={sleep1} alt="Sleep Icon" className="metric-icon" />
                     <p className="metric-value">{metrics.sleepRate} <span>Hrs</span></p>
                     </div>
                  </div>

                  <div className="metric-card1">
                  <p className='metric-head'>Temperature</p>
                  <div className='temp-metrics'>
                     <img src={lung} alt="Lungs Icon" className="metric-icon2" />
                     <p className="metric-value2">
                     {metrics.spo2 ? metrics.spo2.toFixed(2) : 'N/A'} <span>°C</span>
                     </p>
                  </div>
                  </div>
               </div>
            </div>
         </div>

        

         <div className='card2'>
            <div className="emergency-card">
               <h4 className='emgy-text'>Emergency Care</h4>
               <div className='emgy-fix'>
                  {/* <button className="sos-btn">SOS</button> */}
                  <button className="sos-btn" onClick={handleSosClick}>SOS</button>
                  <img src={emgy} alt="Emergency Icon" className="emergency-icon" />
               </div>
            </div>
            <div className="health-card">
               <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} className='health-status'>
                  {metrics.apgarSummary}
                </pre>
            </div>
         </div>
         <p className="last-updated">last updated {metrics.lastUpdated}</p>
      </div>
   );
};

export default Dashboard;
