FinSense – AI Powered Student Budget Assistant

FinSense is a modern, mobile-inspired student finance dashboard that helps you track expenses, understand your spending behavior, and stay within smart budgets — all locally in the browser using localStorage.
It is built on top of the original budget.track project and keeps the existing functionality, while adding a full analytics experience, charts, and gamification.



🎯 Core Goals





Tracking spending with clear categories and notes  



Behavioral analytics with AI-style insights  



Predictive budgeting to warn you early  



Budget alerts when you’re about to overspend  



Gamification with streaks, badges, and a health score  



Strong data visualization using colorful charts



🧰 Tech Stack

Frontend





React 18 (Create React App)



React Router for multi-page navigation



TailwindCSS for styling (tailwindcss + postcss + autoprefixer)



Chart.js + react-chartjs-2 for charts and data visualization

State & Data





localStorage for:





Transactions (income/expense)



Budget configuration (monthly, weekly, category limits)



Utility modules for analytics and calculations:





budgetUtils.js, predictionUtils.js, insightsUtils.js, alertUtils.js, gamificationUtils.js, storage.js

Backend (from original repo)





Node.js + Express simple API (server/) – still present, but FinSense UI works fully offline using localStorage.



🗂 Project Structure (high level)

Root:





package.json – root scripts (dev, server, client, install:all)



server/ – original Express API



client/ – React app with FinSense UI

Client (client/src):





App.jsx – root app, routing, layout, and global state wiring



index.js / index.css – CRA entry + Tailwind setup

Pages (client/src/pages/):





Dashboard.jsx – main analytics dashboard



Transactions.jsx – transaction timeline + filters + add modal



BudgetPlanner.jsx – monthly/weekly/category limits + progress bars



Achievements.jsx – gamification & financial health score



LegacyTracker.jsx – preserves the original single-page tracker flow

Components (client/src/components/):





BalanceCard.jsx – metric cards (Balance/Income/Expenses/Savings)



ExpenseModal.jsx – add income/expense modal



TransactionItem.jsx – transaction row in timelines/lists



AIInsights.jsx – panel for AI-style behavioral insights



BudgetAlert.jsx – panel for smart budget alerts



GamificationPanel.jsx – saving streak, badges, health score card

Charts (client/src/charts/):





chartSetup.js – Chart.js global registration



PieChart.jsx – category spending distribution



WeeklyBarChart.jsx – weekly expenses bar chart



MonthlyLineChart.jsx – monthly cumulative trend

Utils (client/src/utils/):





storage.js – localStorage access (transactions + budgets)



budgetUtils.js – sums, category grouping, weekly and monthly aggregations



predictionUtils.js – predictive budgeting formulas



insightsUtils.js – rule-based AI insights



alertUtils.js – intelligent budget alerts



gamificationUtils.js – saving streak, badges, health score

Data (client/src/data/):





categories.js – canonical category list with emoji + colors

Config:





tailwind.config.js – Tailwind paths and theme extensions



postcss.config.js – integrates Tailwind and Autoprefixer



💻 Running the App

From the project root:

# 1. Install root dependencies
npm install

# 2. Install client + server dependencies
npm run install:all

# 3. Run both API server and React app together
npm run dev





React app (FinSense UI): http://localhost:3000



API server (original project): http://localhost:3001

If you only want the React app:

cd client
npm install   # if not already done
npm start



💰 Data Model

Transactions

Stored in localStorage under:





Key: finsense.transactions.v1

Shape:

{
  id: string;
  type: "income" | "expense";
  amount: number;
  category: "food" | "transport" | "shopping" | "entertainment" | "study" | "income";
  date: "YYYY-MM-DD";
  note: string;
}

Budgets

Stored in localStorage under:





Key: finsense.budgets.v1

Shape:

{
  monthlyLimit: number;
  weeklyLimit: number;
  categoryLimits: {
    food: number;
    transport: number;
    shopping: number;
    entertainment: number;
    study: number;
  };
}



📱 Categories & Icons

Defined in data/categories.js:





Food – 🍕 – food



Transport – 🚌 – transport



Shopping – 🛍 – shopping



Entertainment – 🎮 – entertainment



Study – 📚 – study



Income – 💸 – income

Icons and colors are reused consistently in chips, transaction items, and charts.



🖥 Pages & Features (Summary)

Dashboard





Balance cards (Total Balance, Total Income, Total Expenses, Savings)



Category pie chart, weekly bar chart, monthly line chart (Chart.js)



Predictive budgeting banner



AI Insights panel (spending patterns, weekend vs weekday, highest day)



Budget Alerts panel (daily, weekly, category limit warnings)



Gamification panel (saving streak, badges, financial health score)

Transactions





Date-grouped transaction timeline



Filters by type, category, and date range



+ Add Expense button with modal (amount, category, date, note, type)



Delete transactions, all persisted to localStorage

Budget Planner





Configure monthly and weekly budget limits



Category-specific limits with live “Limit / Spent / Progress %”



Visual progress bars per category

Achievements





Reuses Gamification panel



Explains how badges (Budget Master, Smart Saver, Expense Tracker) are earned

Classic Tracker





/classic route that mirrors the original single-page tracker behavior



Uses the same underlying localStorage data so it stays in sync with FinSense



🚀 Extending FinSense





Connect the UI to the Express API and a real database



Add authentication (student accounts, JWT)



Add more visualizations (calendar heatmap, category drill-downs)



Integrate AI models for natural-language insights and recommendations

