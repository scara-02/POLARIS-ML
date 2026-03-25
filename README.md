# 🛰️ Polaris v3.0: Spatio-Temporal Demand Forecasting & Fleet Optimization

**Polaris v3.0** is an AI-driven urban logistics platform designed to predict real-time demand spikes and optimize drone/vehicle fleet rebalancing. By combining a **Spatio-Temporal Graph Neural Network (GNN)** with a high-performance **Go-based Spatial Engine**, Polaris anticipates urban needs before they occur.

---

## 🏗️ System Architecture

Polaris uses a microservices architecture, fully containerized with Docker, to ensure scalability and isolation between the AI and Spatial components.

* **Spatial Engine (Go):** The high-speed core handling QuadTree indexing, Redis telemetry streams, and coordinate hydration.
* **GNN Sidecar (Python/PyTorch):** A Spatio-Temporal AI that utilizes Graph Attention Networks (GAT) and Gated Recurrent Units (GRU).
* **Real-time Layer (Redis):** Manages low-latency telemetry streaming (Redis Streams) and inter-service messaging.
* **Visualizer (React):** A Leaflet-based dashboard rendering live heatmaps and AI-predicted hotspots.

---

## 🧠 The AI Engine: Spatio-Temporal GNN

The core of Polaris is a custom GNN designed to understand the **topology of the city**. Unlike standard regression models, it treats urban zones as nodes in a graph.

* **Spatial Dimension (GAT):** Graph Attention layers learn the relationships between neighboring zones (e.g., how a spike in a residential area affects a nearby transit hub).
* **Temporal Dimension (GRU):** Processes a sliding window of historical demand ($T=12$ timesteps) to identify rising trends or daily cyclical patterns.
* **Input Features ($N=7$):** Demand, Supply, Lat/Lon, and Temporal features (Sine/Cosine encoding of system time).



---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Dynamic Hotspots** | AI-predicted zones that shift every 10-60s based on real-time system clock and telemetry. |
| **Auto-Rebalancing** | Generates "Relocation Commands" to move assets from low-utilization zones to high-priority hotspots. |
| **Spatial Indexing** | QuadTree-based neighbor lookups for 20+ urban zones with $O(\log n)$ efficiency. |
| **Redis Telemetry** | High-throughput streaming of drone coordinates and demand metrics via Redis Streams. |

---

## 🛠️ Tech Stack

* **Backend:** Go (Gin Framework, slog, Redigo)
* **AI/ML:** Python 3.11, PyTorch, PyTorch Geometric (PyG), Flask
* **Database:** PostgreSQL + PostGIS (Spatial Data), Redis (Real-time Streaming)
* **Frontend:** React, TypeScript, Leaflet.js, Tailwind CSS
* **DevOps:** Docker, Docker Compose

---

## 🚦 Getting Started

### Prerequisites
* Docker & Docker Compose installed on your machine.
* Git installed.

### Setup & Run
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/Polaris.git](https://github.com/YOUR_USERNAME/Polaris.git)
    cd Polaris/v3.0/deployments
    ```

2.  **Launch the platform:**
    ```bash
    docker compose up -d --build
    ```

3.  **Access the Dashboard:**
    Open [http://localhost:5173](http://localhost:5173) in your browser to view the live map and AI predictions.

---

## 📂 Project Structure

```text
.
├── cmd/
│   ├── engine/          # Go Spatial Engine (Hydration & Logic)
│   └── gateway/         # Go API Gateway (Request Routing)
├── internal/
│   ├── handler/         # REST Handlers for Match/Predict
│   └── service/         # Business logic for Drones & Zones
├── ml/
│   └── polaris_demand_gnn.py # Python GNN Sidecar (PyTorch)
├── web/                 # React Frontend (Leaflet Maps)
└── deployments/         # Docker Compose & Environment Configs
