import React, { useState } from 'react';
import './dashboard.css';
import heart from '../assets/heart.png';
import lung from '../assets/lung.png'
import baby from '../assets/baby.jpg'
import emgy from '../assets/emgy.jpg'
import sleep1 from '../assets/sleep1.png'
import logo from '../assets/logo.png'

const Dashboard = () => {
   const [metrics, setMetrics] = useState({
      heartRate: 170,
      spo2: 98,
      sleepRate: '07:11',
      babyColor: '#f28b82',
      lastUpdated: '10 seconds ago'
   });

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
               <img src={baby} alt="Baby in Incubator" className="incubator-image" />
               <div className="video-label">baby 0.81</div>
            </div>
            
            <div className='main ob'>
            <div className='observes1'>
            <div className="metric-card">
               <p className='metric-head'>Heart Rate</p>
               <img src={heart} alt="Heart Icon" className="metric-icon1" />
               <p className="metric-value1">{metrics.heartRate} <span>BPM</span></p>
            </div>

            <div className="metric-card">
               <p className='metric-head'>SPO₂</p>
               <img src={lung} alt="Lungs Icon" className="metric-icon2" />
               <p className="metric-value2">{metrics.spo2}%</p>
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