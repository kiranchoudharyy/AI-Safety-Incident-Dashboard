# AI Safety Incident Tracker

A modern React application designed to track, manage, and analyze AI safety incidents. This application allows users to report, view, and filter incidents based on severity, status, and other criteria.

## Features

- **Incident Management**: Add, view, and filter AI safety incidents
- **Dynamic Filtering**: Filter by severity, status, and search terms
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Statistics**: View incident breakdowns by severity and status
- **Fullscreen Mode**: Expand the application to fullscreen for better visibility

## Project Structure

```
ai_safety/
├── public/               # Static assets
├── src/                  # Source files
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── index.html            # HTML template
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── README.md             # Project documentation
```

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting and formatting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/kiranchoudharyy/AI-Safety-Incident-Dashboard.git
   cd ai_safety
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

1. Create a production build
   ```
   npm run build
   ```

2. Preview the production build
   ```
   npm run preview
   ```

## Usage

1. **Viewing Incidents**: Browse through the list of AI safety incidents
2. **Adding New Incidents**: Click on "Report New Incident" to add a new entry
3. **Filtering**: Use the filter options to sort by severity or status
4. **Searching**: Use the search bar to find specific incidents
5. **Statistics**: Toggle the statistics view to see incident breakdowns

## License

This project is licensed under the MIT License - see the LICENSE file for details.
