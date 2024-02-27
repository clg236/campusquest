from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import os
import sys

app = Flask(__name__)
CORS(app) 

# these should be an in .env file, but for now we'll just hardcode them
DB_HOST = "128.122.85.30"
DB_USER = "student"
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = "campus_quest"

def run_query(sql):
    connection = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, db=DB_NAME)
    try:
        with connection.cursor() as cursor:
            cursor.execute(sql)
            # gotta fetch the column names (not sure this will work...)
            column_names = [col[0] for col in cursor.description]
            # get all of the rows
            rows = cursor.fetchall()
            
            result = {"columns": column_names, "rows": rows}
            return result
    finally:
        connection.close()

@app.route('/execute-sql', methods=['POST'])
def execute_sql():
    data = request.json
    sql_query = data['sql']

    connection = pymysql.connect(
        host="128.122.85.30",
        user="student",
        passwd="SternRocks888!",
        db="campus_quest"
    )

    try:
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            column_names = [col[0] for col in cursor.description]
            print(column_names, file=sys.stderr)
            result = cursor.fetchall()
            result = {"columns": column_names, "rows": result}
            return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        connection.close()

if __name__ == '__main__':
    ## app.run(debug=True)
    app.run(debug=True ,port=3000,use_reloader=True)