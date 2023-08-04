import json
from flask import Flask, render_template, request, jsonify
import pandas as pd
from flask_cors import CORS
import matplotlib.pyplot as plt
import numpy as np
import itertools
import statsmodels.api as sm
import warnings
import plotly.io as pio
from statsmodels.tsa.statespace.sarimax import SARIMAX
from pmdarima.arima import auto_arima
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error
from flask import jsonify
import base64
import plotly.graph_objs as go
import plotly.offline as pyo
from flask import Flask, Response 
 
app = Flask(__name__)
CORS(app)
cors=CORS(app, resources={
     r"/*":{
         "origins" : "*"  
     }
 })
@app.route('/result', methods=['GET'])
def result():
    return jsonify({'accuracy': accuracy, 'rmse': rmse})
@app.route('/upload', methods=['POST'])
def upload():
    warnings.filterwarnings('ignore')
    hello = request.files.get('files')
    type = request.form.get('IntervalType')
    type_value = request.form.get('IntervalValue')

    if type_value is None:
        return jsonify({'error': 'IntervalValue not provided'})
    type_value = int(type_value)
    df = pd.read_csv(hello, parse_dates=['Order Date'], index_col=['Order Date'])
    df['Postal Code'].fillna(df['Postal Code'].median(), inplace=True)
    technology=df.loc[df['Category']=='Technology'].copy()
# Drop unnecessary columns
    r_col = ['Row ID', 'Order ID', 'Ship Date', 'Ship Mode', 'Customer ID', 'Customer Name', 'Segment', 'Country', 'City', 'State', 'Postal Code', 'Region', 'Product ID', 'Category', 'Sub-Category', 'Product Name']
    technology.drop(r_col, axis=1, inplace=True)

# Sort the data by order date
    technology = technology.sort_values('Order Date')

# Get interval type and value from user input
    interval_type = type
    interval_value = type_value
# Resample data to desired interval
    resampled_data = technology.resample(interval_type).sum()
    data = resampled_data['Sales']

# Split the data into train and test sets
    train_data, test_data = train_test_split(data, test_size=0.2, shuffle=False)

# Fit SARIMA model
    model = SARIMAX(train_data, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
    results = model.fit()

# Predict the future sales on the test set
    future = results.predict(start=len(train_data), end=len(data)-1, dynamic=False, typ='levels')

# Calculate the accuracy and RMSE
    mape = mean_absolute_percentage_error(test_data, future)
    mse = mean_squared_error(test_data, future)
    global rmse 
    rmse = np.sqrt(mse)
    global accuracy 
    accuracy = 1 - mape
    
# Fit SARIMA model on the entire data
    model = SARIMAX(data, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
    results = model.fit()

# Make future predictions
    future_dates = pd.date_range(start=resampled_data.index[-1], periods=interval_value, freq=interval_type)
    forecast = results.predict(start=len(resampled_data), end=len(resampled_data)+interval_value-1, dynamic=False, typ='levels')

# Visualize time series and forecast
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=resampled_data.index, y=resampled_data['Sales'], name='Observed'))
    fig.add_trace(go.Scatter(x=future_dates, y=forecast, name='Forecast'))
    fig.update_layout(title='Sales Forecast Prediction',
                          xaxis_title='Date',
                          yaxis_title='Value',width=1200, height=600)
    # fig.show()
    html = pyo.plot(fig, output_type="div")
   
    # return Response(html, mimetype="text/html")
    
    return jsonify({'accuracy': accuracy, 'rmse': rmse,'graph_data':html})
    # fig = go.Figure()
    # fig.add_trace(go.Scatter(x=[1, 2, 3], y=[4, 5, 6]))
    # fig.update_layout(title="My Plot", xaxis_title="X", yaxis_title="Y")
    # html = pyo.plot(fig, output_type="div")
   