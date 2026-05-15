# Car Price Prediction and Recommendation System

## 📖 What is This Project?

This is an **AI-Powered Car Price Prediction System** built with modern web technologies. The application uses machine learning algorithms to help users predict the market value of cars based on various parameters such as brand, model, year, mileage, fuel type, transmission, condition, and engine capacity.

The system provides an intuitive interface where users can input car details and receive instant price predictions, helping buyers and sellers make informed decisions in the automotive market.

## ✨ What You Can Do With This Project

- **🔮 Predict Car Prices**: Enter car specifications and get instant price predictions powered by advanced ML algorithms
- **📊 View Statistics**: Access dashboard with prediction analytics and insights
- **🔐 User Authentication**: Secure login and signup functionality for personalized experience
- **💡 Smart Recommendations**: Get intelligent price recommendations based on market data
- **📱 Responsive Design**: Use the application seamlessly on desktop, tablet, or mobile devices
- **⚡ Real-time Results**: Instant predictions with modern, fast UI/UX

## 🎯 Key Features

- Modern, gradient-based UI design
- Form validation for accurate data entry
- Real-time price prediction display
- User-friendly navigation
- Comprehensive car detail input fields:
    - Brand and Model
    - Manufacturing Year
    - Mileage
    - Fuel Type (Petrol, Diesel, Electric, Hybrid)
    - Transmission Type (Manual, Automatic)
    - Car Condition (New, Used)
    - Engine Capacity (CC)

## 🚀 How to Run the Frontend

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (version 20 or higher)
- **npm** (comes with Node.js)

### Installation Steps

1. **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

4. **Open your browser:**

    The application will be available at: `http://localhost:3000`

### Available Scripts

- `npm run dev` - Starts the development server (with hot reload)
- `npm run build` - Builds the application for production
- `npm start` - Runs the production build
- `npm run lint` - Runs ESLint to check code quality

## 🛠️ Technology Stack

### Frontend

- **Next.js 16.1.6** - React framework for production
- **React 19.2.3** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## 📂 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   │   ├── login/       # Login page
│   │   │   └── signup/      # Signup page
│   │   ├── (site)/          # Main site pages
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── dashboard/   # Dashboard page
│   │   │   └── predict/     # Prediction page
│   │   ├── globals.css      # Global styles
│   │   └── layout.tsx       # Root layout
│   ├── components/
│   │   ├── layout/          # Layout components (Navbar, etc.)
│   │   └── predict/         # Prediction form and results
│   ├── services/            # API services
│   ├── store/               # State management
│   ├── utils/               # Utility functions
│   └── validations/         # Form validations
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
```

## 🎨 Features in Detail

### Landing Page

- Eye-catching gradient hero section
- Key statistics display (10K+ predictions, 95% accuracy)
- Call-to-action buttons for quick access

### Prediction Page

- Comprehensive form for car details input
- Real-time validation
- Instant price prediction results
- Visual feedback with loading states

### Dashboard

- Overview of user predictions
- Analytics and insights

## 📝 Notes

- Currently uses mock prediction data for demonstration
- Backend integration ready (backend folder structure prepared)
- Authentication pages created and ready for integration

## 🔜 Future Enhancements

- Connect to actual ML backend for real predictions
- User profile management
- Prediction history tracking
- Price comparison with market trends
- Car recommendation engine
- Multi-language support

---
