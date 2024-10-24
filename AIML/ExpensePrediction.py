from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
 
app = Flask(__name__)
CORS(app)
 
# Constants
EXPENSES_URL = 'http://localhost:5000/api/expenses'  # Your backend URL for fetching expenses
CATEGORIES_URL = 'http://localhost:5000/api/category'  # Your backend URL for fetching categories
 
@app.route('/')
def home():
    return "Welcome to the Expense Prediction API!"
 
def fetch_expenses(token):
    """Fetch expenses from the backend."""
    try:
        response = requests.get(
            f'{EXPENSES_URL}/list',
            headers={'Authorization': f'Bearer {token}'}
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return []
 
def fetch_categories(token):
    """Fetch all categories from the backend."""
    try:
        response = requests.get(
            f'{CATEGORIES_URL}/list',
            headers={'Authorization': f'Bearer {token}'}
        )
        return {category['name']: category['name'] for category in response.json()}  # Mapping based on the name
    except requests.RequestException as e:
        return {}
 
def prepare_data(expenses_data, category_mapping):
    """Prepare data for analysis by mapping categoryName to category name."""
    expenses = []
    for expense in expenses_data:
        category_name = category_mapping.get(expense['categoryName'], "Unknown Category")  # Get category name
        
        # Safely convert amount to float
        try:
            amount = float(expense['amount'])  # Ensure amount is a float
        except ValueError:
            continue  # Skip this expense if conversion fails
        
        month = pd.to_datetime(expense['date']).month
        year = pd.to_datetime(expense['date']).year
 
        expenses.append({
            'category_name': category_name,
            'amount': amount,
            'month': month,
            'year': year
        })
    return pd.DataFrame(expenses)
 
def build_and_predict_next_year_expenses(df):
    """Build a model and predict next year's expenses."""
    # Aggregate expenses by category and year
    yearly_expenses = df.groupby(['category_name', 'year']).sum().reset_index()
 
    # Encode the category names to numeric
    le = LabelEncoder()
    yearly_expenses['category_encoded'] = le.fit_transform(yearly_expenses['category_name'])
 
    # Prepare the features (X) and target (y)
    X = yearly_expenses[['category_encoded', 'year']]
    y = yearly_expenses['amount']
 
    # Train a linear regression model
    model = LinearRegression()
    model.fit(X, y)
 
    # Predict the next year's expenses
    next_year = yearly_expenses['year'].max() + 1
    next_year_data = pd.DataFrame({
        'category_encoded': yearly_expenses['category_encoded'].unique(),
        'year': next_year
    })
 
    predictions = model.predict(next_year_data)
    # Decode the encoded categories back to the original category names
    predicted_expenses = pd.DataFrame({
        'category_name': le.inverse_transform(next_year_data['category_encoded']),
        'predicted_amount': predictions
    })
 
    return predicted_expenses
 
def calculate_current_year_expenses(df, current_year):
    """Calculate current year's expenses grouped by category."""
    current_year_expenses = df[df['year'] == current_year].groupby('category_name').sum().reset_index()
    current_year_expenses = current_year_expenses[['category_name', 'amount']]  # Keep only necessary columns
    current_year_expenses = current_year_expenses.rename(columns={'amount': 'current_year_amount'})
    return current_year_expenses
 
@app.route('/predict-expenses', methods=['GET'])
def run_expense_prediction():
    """Run the expense prediction model and return current and predicted expenses."""
    try:
        token = request.headers.get('Authorization').split(" ")[1]  # Extract token from "Bearer {token}"
        # Fetch expenses data and category mapping
        expenses_data = fetch_expenses(token)
        if not expenses_data:
            return jsonify({"error": "No expense data found."})
 
        category_mapping = fetch_categories(token)
        if not category_mapping:
            return jsonify({"error": "Failed to fetch categories."})
 
        # Prepare the data for analysis
        df = prepare_data(expenses_data, category_mapping)
 
        # Calculate the current year based on the existing data
        current_year = pd.to_datetime('today').year
 
        # Calculate current year's expenses
        current_year_expenses = calculate_current_year_expenses(df, current_year)
 
        # Build and predict the next year's expenses
        predicted_expenses = build_and_predict_next_year_expenses(df)
 
        # Combine current and predicted expenses into a single response
        combined_expenses = pd.merge(current_year_expenses, predicted_expenses, on='category_name', how='outer')
 
        # Return the combined expenses
        return jsonify(combined_expenses.to_dict(orient='records'))
    except Exception as e:
        return jsonify({"error": str(e)})
 
if __name__ == "__main__":
    app.run(debug=True, port=5002)