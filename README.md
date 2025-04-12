This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





















# 🚑 Federated Learning Simulation for Hospitals (PBL Project)

This project is a **federated learning simulation** using a single device to represent **10 different hospitals** collaborating to train a machine learning model while preserving data privacy. It demonstrates the core concepts of **local training**, **model weight aggregation**, **central model creation**, and **redistribution**, all visualized via an interactive web application.

---

## 🎯 Objective

To simulate a real-world federated learning scenario using Next.js, Tailwind CSS, and TypeScript where:

- Each hospital trains its own model locally.
- Hospitals send their model weights to a central server.
- A central model is created using averaged weights.
- The central model is redistributed back to all hospitals.
- Each hospital can retrain its data using the improved global model.

---

## 🧠 Key Features

### 🔹 Hospital View (`/hospital`)
- Dropdown to select hospital (1 to 10)
- `Train Local Model` button:
  - Trains local model for that hospital (simulates training for all in backend)
  - Shows local accuracy, logs
- `Send Trained Weights` button:
  - Simulates sending trained weights to central server
- `Retrain Using Central Model` button:
  - Simulates updating hospital model with central model

---

### 🔹 Server View (`/server`)
- Shows logs of:
  - Received model weights from hospitals
  - Status of central model generation (e.g. averaging weights)
  - Distribution of central model to all hospitals

---

### 🔹 All Hospitals Overview (`/all-hospitals`)
- Displays 10 hospital cards showing:
  - Local model accuracy
  - Global model accuracy
- Button: `Train All with Central Model` (simulates retraining all hospitals)
- Visual comparison chart: Before vs After training

---

## 🛠 Technologies Used

- **Frontend**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js or Recharts (for visualizing model performance)
- **State Management**: React Context API or Zustand
- **Optional Backend**: Simulated using in-memory logic or Flask API (optional)

---

## 📦 Project Structure
/pages ├── index.tsx ├── hospital.tsx ├── server.tsx └── all-hospitals.tsx

/components ├── HospitalCard.tsx ├── AccuracyChart.tsx └── LogBox.tsx



---

## 🧪 How Simulation Works Internally

- All 10 hospitals are simulated in a single backend file.
- Each hospital trains on a portion of the smoking dataset.
- Real model training is performed using XGBoost.
- The backend API provides real accuracy values from model training.
- Models are aggregated using a federated averaging approach.
- The global model is fine-tuned for each hospital to improve accuracy.

---

## 📈 Learning Outcome

- Demonstrates how federated learning improves model accuracy while keeping data local.
- Shows collaboration across hospitals in a privacy-preserving way.
- Visualizes model training and aggregation in a realistic, intuitive interface.

---

## 🔚 Final Deliverables

1. Jupyter Notebook (proof of concept, accuracy graphs)
2. Interactive Web App
3. Executable simulation of hospital collaboration
4. README documentation (this file)

---

## 🚀 Running the Application

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Make sure you have the `smoking.csv` dataset in the backend directory.

### Start the Backend Server

Run the backend server using the provided batch file:
```
run_backend.bat
```

Or manually:
```
cd backend
python app.py
```

The server will start on http://localhost:5000.

### Start the Frontend Development Server

```
npm run dev
```

The frontend will be available at http://localhost:3000.
