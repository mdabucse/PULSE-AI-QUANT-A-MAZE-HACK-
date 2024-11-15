# PULSE AI
![logo-removebg-preview](https://github.com/user-attachments/assets/bdddc07c-77e8-4074-bab2-f717fa4254aa)

Non - Conatact Vital Monitoring 💟

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Flowchart](#flowchart)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
- [Output](#output)
- [Contributing](#contributing)



## Introduction

The need for an AI-powered Neonatal Vital Monitoring System stems from the critical care required in NICUs for premature and high-risk newborns. Traditional systems can be uncomfortable and may not provide real-time, comprehensive monitoring, leading to delayed detection of health risks. AI-driven solutions offer continuous, non-invasive monitoring and real-time anomaly detection, helping reduce errors and improve response times. By providing predictive insights, this system enhances neonatal care, ensuring timely interventions and better health outcomes for vulnerable infants.

## Features
* **Heart Rate Monitoring**
* **Temperature**
* **Color Detection**
* **Sleep Cycle**
* **SOS Call Alert**
* **APGAR Score Calculation Using LLM**
* **Report Generation**

## Flowchart
![logo](https://raw.githubusercontent.com/mdabucse/PULSE-AI-QUANT-A-MAZE-HACK-/refs/heads/master/Docmentation/flow.jpeg)


### User Features
- **Product Catalog**: Browse a wide range of tech gadgets.
- **Category Search**: Search products by categories using buttons for specific filters.
- **Cart Management**: Add products to the cart and select items for checkout.
- **Order Summary and Checkout**: View selected products, confirm details, and place orders.
- **Secure Authentication**: Register and login securely with token-based authentication.

### Admin Features
- **Product Management**: Add, edit, and delete products.
- **Inventory Management**: Keep track of product stock levels.
- **Sales Analytics**: Monitor product orders and sales trends.
- **User Type Control**: Display different interfaces for admins and users.

## Tech Stack

- **Frontend**: 
  - React
  - Redux 
  - Vite
- **Backend**: 
    - Node.js
    - Express
    - Python
- **Model**:
    - OpenCV
    - OpenAI
    - Scipy
    - Dlib
    - Flask
    - langchain
    - langchain-core
    - mediapipe
    - matplotlib 



## Setup and Installation
- ### Step 1 
    - <pre><code> git clone https://github.com/mdabucse/PULSE-AI-QUANT-A-MAZE-HACK- </pre></code>

- ### Step 2 (Setup the Server)
    - <pre><code> cd server </pre></code>
    - <pre><code> python -m venv server </pre></code>
    - <pre><code> server/Scrits/Activate </pre></code>
    - <pre><code> pip install -r requiremnts.txt </pre></code>
    - <pre><code> python camera.py </pre></code>

- ### Step 3 (Setup the Model)
    - <pre><code> cd model </pre></code>
    - <pre><code> conda create --name model python=3.8 </pre></code>
    - <pre><code> conda activate model </pre></code>
    - <pre><code> pip install -r requiremnts.txt </pre></code>
    - <pre><code> python backend.py </pre></code>

- ### Step 4 (Setup the Frontend)
    - <pre><code> cd frontend </pre></code>
    - <pre><code> npm install --force </pre></code>
    - <pre><code> npm run dev </pre></code>


## Endpoints
- Camera : http://localhost:8000/video_feed
- Backend : http://localhost:5000/
- FrontEnd : http://localhost:5173/

## Output
![image](https://github.com/user-attachments/assets/78b0e3a6-504d-4b28-9274-6f2537f1c63f)
![image](https://github.com/user-attachments/assets/3c0277d1-4555-4bde-ba49-8b06b418476b)
![image](https://github.com/user-attachments/assets/dbf5db9e-e490-413e-ad17-47c6b850a276)
![image](https://github.com/user-attachments/assets/16fb9d87-5ca6-4185-977f-d2c38df84392)
![image](https://github.com/user-attachments/assets/a6119d7c-d75a-407d-a93c-aade42f8fdbd)
![image](https://github.com/user-attachments/assets/6ea6c7be-1995-49e1-9782-799f33de6d99)






## Contributors
- Harish R  https://www.linkedin.com/in/harish-r-12372b28b/
- Janani M  https://www.linkedin.com/in/janani-manikandan-7a01b624a/
