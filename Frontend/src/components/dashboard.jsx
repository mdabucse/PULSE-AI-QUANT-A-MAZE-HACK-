import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import './dashboard.css';
import heart from '../assets/heart.png';
import lung from '../assets/lung.png';
import baby from '../assets/baby.jpg';
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
      lastUpdated: 'N/A'
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
            {/* <div className="video-feed">
               <img src={baby} alt="Baby in Incubator" className="incubator-image" />
               <div className="video-label">baby 0.81</div>
            </div> */}
            <div className="video-feed">
               {/* Embed video feed using <video> tag */}
               <video
                  src="http://127.0.0.1:8000/video_feed"
                  alt="Live Video Feed"
                  className="video-stream"
                  autoPlay
                  muted
                  controls
                  width="100%"
                  height="auto"
               />
               <div className="video-label">baby 0.81</div>
            </div>

            <div className='main ob'>
               <div className='observes1'>
                  <div className="metric-card">
                     <p className='metric-head'>Heart Rate</p>
                     <img src={heart} alt="Heart Icon" className="metric-icon1" />
                     <div className="heart-rate-chart">
                      <Line data={heartRateData} />
                     </div>
                     <p className="metric-value1">{metrics.heartRate} <span>BPM</span></p>
                  </div>

                  <div className="metric-card">
                     <p className='metric-head'>Temperature</p>
                     <img src={lung} alt="Lungs Icon" className="metric-icon2" />
                     <p className="metric-value2">
                     {metrics.spo2 ? metrics.spo2.toFixed(2) : 'N/A'} <span>°C</span>
                     </p>
                  </div>
            </div>

               <div className='observes2'>
                  <div className="metric-card">
                     <p className='metric-head'>Sleep Rate</p>
                     <img src={sleep1} alt="Sleep Icon" className="metric-icon" />
                     <p className="metric-value">{metrics.sleepRate} <span>Hrs</span></p>
                  </div>

                  <div className="metric-card baby-color">
                     <p className='metric-head1'>Baby Color</p>
                     <div className="color-display" style={{ backgroundColor: metrics.babyColor }}></div>
                  </div>
               </div>
            </div>
         </div>

        

         <div className='card2'>
            <div className="emergency-card">
               <h4 className='emgy-text'>Emergency Care</h4>
               <div className='emgy-fix'>
                  <button className="sos-btn">SOS</button>
                  <img src={emgy} alt="Emergency Icon" className="emergency-icon" />
               </div>
            </div>
            <div className="health-card">
               <p className="health-status">The baby is in excellent health, displaying stable and consistent vital signs.</p>
            </div>
         </div>
         <p className="last-updated">last updated {metrics.lastUpdated}</p>
      </div>
   );
};

export default Dashboard;
