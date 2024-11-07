# Toronto Crime Data Visualization (2014-2023)

This project visualizes crime statistics across Toronto neighborhoods from 2014 to 2023, with special attention to neighborhoods containing Consumption and Treatment Sites (CTS). The visualization includes trend lines for different types of crimes and indicates when CTS sites opened in specific neighborhoods.

## 🔗 [Live Demo](#) <!-- Add your GitHub Pages URL here once deployed -->

![Screenshot](crime_charts/placeholder.png) <!-- Consider adding a screenshot of your visualization -->

## 🎯 Features

- Interactive crime trend visualizations for all Toronto neighborhoods
- Special highlighting of neighborhoods with CTS sites
- Timeline markers showing CTS site opening dates
- Mobile-responsive design
- Search functionality
- Click-to-expand detailed views

## 🏃‍♂️ Quick Start

```bash
# Clone the repository
git clone <your-repository-url>
cd toronto-crime-viz

# Set up Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install pandas plotly

# Run the visualization generator
python crime_analysis.py
```

The script will generate a `crime_charts` directory containing:
- Individual interactive charts for each neighborhood
- A main `gallery.html` file that displays all visualizations

## 📊 Data Sources

- Crime data: Toronto Police Service's Open Data Portal
- CTS site information:
  - The Works (Toronto Public Health) - 2017
  - South Riverdale Community Health Centre - 2017
  - Parkdale Queen West Community Health Centre - 2017
  - Regent Park Community Health Centre - 2017
  - Fred Victor Centre - 2017
  - Street Health - 2017
  - Moss Park CTS - 2017
  - Casey House - 2022
  - Kensington Market OPS - 2022

## 🛠️ Technical Stack

- Python 3.9+
- Pandas for data processing
- Plotly for interactive visualizations
- HTML/CSS for gallery interface

## 📝 License

[MIT License](LICENSE)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#).

## 🙏 Acknowledgments

- Toronto Police Service for the open data
- Toronto Public Health for CTS site information

## 📧 Contact


Project Link: [https://github.com/nullishptr/toronto-crime-cts](#)

---

Made with ❤️ in Toronto
