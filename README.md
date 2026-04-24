# Node.js Weather App (SSR)

A simple weather application built using Node.js that fetches real-time weather data from the OpenWeather API and renders it on the server using a custom templating approach.

## 🚀 Features

- Fetch real-time weather data by city
- Server-side rendering (SSR) using Node.js
- Basic routing using native HTTP module
- Dynamic HTML templating using placeholder replacement
- Error handling for invalid city input
- Default UI with search functionality

## 🛠️ Tech Stack

- Node.js (HTTP module)
- HTML / CSS
- OpenWeather API
- Custom template rendering (no framework)

## 📂 Project Structure
```
.
├── index.js
├── home.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```
## 📋 Prerequisites

Make sure you have the following installed:

- Node.js (v14 or higher recommended)

You can verify installation using:
```
node -v
```
```
npm -v
```

## ⚙️ Installation & Setup

1. Clone the repository

2. Install dependencies
```
npm install
```

3. Run the application
```
node index.js
```

4. Open in browser
```
http://localhost:8000
```

## 🔍 Usage

- Open the application in your browser
- Enter a city name in the search box
- View real-time weather details

## 📖 Learning Outcomes

This project demonstrates:

- How HTTP servers work in Node.js
- Server-side rendering concepts
- API integration and data handling
- Basic routing without frameworks
