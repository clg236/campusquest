from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import os
from openai import OpenAI
import json

app = Flask(__name__)
CORS(app)

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

client = OpenAI(api_key=os.getenv("OPEN_AI_KEY"))

def send_to_llm(sql_error, sql_query):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
              messages=[
                {
                "role": "user",
                "content": f"Please help a student learning SQL understand what they did wrong to have this error occur: {sql_error}. Here was their SQL: {sql_query}. Please only return one or two sentences as helpful hints.",
                }
            ],
            temperature=0.5,
            max_tokens=100,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )
        hint = response.choices[0].message.content  # Make sure this path matches the actual response structure
        print(hint)
        return hint

    except Exception as e:
        return str(e)

@app.route('/execute-sql', methods=['POST'])
def execute_sql():
    data = request.json
    sql_query = data.get('sql', '')
    
    if not sql_query:
        return jsonify({"error": "SQL query is missing."})

    try:
        connection = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, db=DB_NAME)
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            column_names = [col[0] for col in cursor.description]
            result = cursor.fetchall()
            return jsonify({"columns": column_names, "rows": result})
    except Exception as e:
        error_message = str(e)
        hint = send_to_llm(error_message, sql_query)
        return jsonify({"error": error_message, "hint": hint})
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=3000, use_reloader=True)
