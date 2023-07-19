<h1 align="center">
  <br>
  <a href="https://github.com/iambijayyy/KapdaBazar"><img src="https://github.com/iambijayyy/KapdaBazar/blob/master/frontend/public/logo192.png" alt="Predict It" width="300"></a>
</h1>

<h4 align="center">A online e-commerce fashion portal dealing in variety of fashion and clothing products developed with emphasis on cyber security principles for secure interface. </h4>

<p align="center">
  <a href="#about-the-project">About The Project</a> •
  <a href="#dataset">Dataset</a> •
  <a href="#models">Models</a> •
  <a href="#predict-it-features">Predict It Features</a> •
  <a href="#how-to-use">How To Use</a>
</p>

<p align="center">
  <img src="https://github.com/iambijayyy/PredictIt/blob/master/static/ezgif.com-video-to-gif.gif" alt="screenshot" width="800">
</p>

## About The Project

<h4 align="left"> The Kapda Bazar e-commerce application represents a comprehensive synthesis of innovative design and robust security measures. This report delves into the intricate architecture and features that underpin its development, highlighting key aspects such as input validation, role-based access control, data encryption, two-factor authentication, session management, and audit logs. Through a meticulous exploration of each component, this report showcases how the application ensures data accuracy, user privacy, and system integrity. The agile Scrum methodology, encompassing four one-month sprints, facilitated iterative development and efficient adaptation to evolving requirements. In the backdrop of these methodologies, the Kapda Bazar application emerges as a prime example of user-centric design and state-of-the-art security practices, attuned to contemporary e-commerce demands. </h4>

## Dataset

<h4 align="left"> The machine learning models were tested on datasets from two distinct sources: NABIL and AAPL (Apple Inc). The data of NABIL was taken from NepseApha while the data of AAPL was taken through Yahoo Finance API. NumPy was used for data manipulation, and Pandas for data cleaning and preprocessing. Python libraries like NumPy and Pandas were instrumental in feature engineering as well. Exploratory data analysis (EDA) was carried out using Matplotlib and Seaborn, creating informative visualizations and identifying correlations between features and stock price movements. </h4>

## Models

<h4 align="left"> The project aimed to evaluate and compare six machine learning algorithms for stock price prediction, including Naive, Simple Moving Average, SMA 5, SMA 20, Linear Regression, ARIMA, and LSTM. Python's libraries, Scikit-learn, TensorFlow, and Keras, were used to implement and train these algorithms. The process involved preparing a dataset divided into training and testing sets, and setting hyperparameters like window size, epochs, learning rates, and activation functions to ensure accurate predictions and capture underlying patterns in stock price data. </h4>

## Results
<h1 align="center">
  <br>
  <a href="https://github.com/iambijayyy/PredictIt"><img src="https://github.com/iambijayyy/PredictIt/blob/master/Comparative%20Analysis/Images/COMPARISION/MAE%20OF%20ALL%20MODELS%20TESTED_VERTICAL_WITH_HORIZONTAL_LABELS_AND_INCREASED_GAP.png" alt="PredictIt" width="400"></a>
</h1>
<h4 align="left"> The disparities in MAE values that exist between the various algorithms highlight how critical it is to select appropriate models based on the prediction tasks at hand. When it comes to capturing the complexities of Dinancial market data, more complex and sophisticated models, such as ARIMA and LSTM, demonstrate superior performance. While simpler models, such as Naive and SMA, might be sufDicient for basic forecasting, more complex and sophisticated models, such as ARIMA and LSTM, do not. In conclusion, the Dindings of the research present convincing evidence for the utilization of advanced machine learning models, such as LSTM, for accurate stock price prediction. </h4>

## Predict It Features
<h4 align="left"> Predict It is developed using Python's web framework Django implementing LSTM model which performed the best in the comparative analysis. It has following features: </h4>

* Stock Prediction
  - Get instant predictions of stock prices as you input data.
* Stocks Comparision
  - Comapre two stocks within given timeframe.
* Interactive Visualization
  - Visualize stock price trends and model predictions in real-time.
* Real-Time Data Integration
  - Stay updated with the latest market data through Yahoo Finance API integration.
* Exportable Reports
  - Save prediction results in csv format for future reference.
* Platform Compatibility
  - Compatible with different devices, screen sizes and OS.

## How To Use

```bash
# Clone this repository
$ git clone https://github.com/iambijayyy/PredictIt.git

# Go into the repository
$ cd PredictIt

# Install virtual environment
$ pip install virtualenv

# Create virtual environment
$ virtualenv venv

# Activate virtual environment (Windows)
$ venv\Scripts\activate

# Activate virtual environment (macOS and Linux)
$ source venv/bin/activate

# Install dependencies
$ pip install -r requirements.txt

# Database setup
$ python manage.py migrate

# Run application
$ python manage.py runserver
```
