from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import os

app = Flask(__name__)
CORS(app) 

# Database connection parameters
DB_HOST = "128.122.85.30"
DB_USER = "student"
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = "campus_quest"

def run_query(sql):
    connection = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, db=DB_NAME)
    try:
        with connection.cursor() as cursor:
            cursor.execute(sql)
            # Fetch column names
            column_names = [col[0] for col in cursor.description]
            # Fetch all rows
            rows = cursor.fetchall()
            # Combine column names and rows for a more descriptive result
            result = {"columns": column_names, "rows": rows}
            return result
    finally:
        connection.close()

@app.route('/execute-sql', methods=['POST'])
def execute_sql():
    # Assuming you have already set 'DB_PASSWORD' in your environment variables
    password = os.environ.get('DB_PASSWORD')
    data = request.json
    sql_query = data['sql']

    connection = pymysql.connect(
        host="128.122.85.30",
        user="student",
        passwd=password,
        db="campus_quest"
    )

    try:
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            result = cursor.fetchall()
            return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True)