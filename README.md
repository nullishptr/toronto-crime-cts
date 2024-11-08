# Toronto Crime Analysis Dashboard

An interactive visualization dashboard analyzing crime patterns in Toronto's Community Treatment Sites (CTS) and control neighborhoods. This project examines the impact of CTS implementation on local crime rates through various statistical approaches including difference-in-differences analysis, trend analysis, and indexed comparisons.

## 📊 Features

- **Difference-in-Differences Analysis**: Compares violent crime trends between CTS and control areas before and after implementation
- **Trend Analysis**: Visualizes deviations from expected crime trends using detrended data
- **Indexed Comparisons**: Shows relative changes in crime rates normalized to the 2016 baseline
- **Interactive Visualizations**: Built with Recharts for smooth, responsive data exploration
- **Focus on Violent Crime**: Analyzes key crime categories including:
  - Assault
  - Break and Enter
  - Robbery
  - Shootings

## 🚀 Live Demo

Visit the dashboard at: [https://nullishptr.github.io/toronto-crime-cts](https://nullishptr.github.io/toronto-crime-cts)

## 🛠️ Technology Stack

- React + TypeScript
- Vite for build tooling
- Recharts for data visualization
- Tailwind CSS for styling
- shadcn/ui for UI components

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/nullishptr/toronto-crime-cts.git

# Navigate to project directory
cd project-name

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📈 Data Sources

This dashboard analyzes Toronto neighborhood crime data from 2014-2023, focusing on:
- 6 CTS implementation sites (implemented in 2017)
- 6 control neighborhoods for comparison
- Various violent crime categories

## 📋 Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom hooks including data fetching
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and data processing
└── pages/             # Page components
```

## 📊 Analysis Methods

### Difference-in-Differences
Examines the causal impact of CTS implementation by comparing changes in crime rates between treatment and control areas before and after 2017.

### Trend Analysis
Uses linear regression to detrend crime data, showing deviations from expected patterns for both CTS and control neighborhoods.

### Indexed Analysis
Normalizes crime rates to 2016 baseline (index=100) to show relative changes over time.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- [@nullishptr](https://github.com/nullishptr)

## 🙏 Acknowledgments

- Toronto Public Health for CTS implementation data
- Toronto Police Service for crime statistics

## 📬 Contact

For questions or feedback, please open an issue on GitHub