from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import datetime
import os
from openai import OpenAI
import json
import sys

app = Flask(__name__)
CORS(app);

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

client = OpenAI(api_key=os.getenv("OPEN_AI_KEY"))

@app.route('/feedback', methods=['GET'])
def feedback():
    connection = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, db='campus_quest')
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM queries")
            records = cursor.fetchall()
            formatted_records = "\n".join([f"Name: {record[1]}, SQL Query: {record[2]}, Executed At: {record[3]}" for record in records])
            
            prompt = f"Please take a look at these SQL queries and let me know if anyone needs a bit of extra help:\n{formatted_records}. Please  split feedback into individual feedback items separated by a double newline (\n\n)"
            
            response = client.chat.completions.create(
                model="gpt-4", 
                messages=[
                    {
                        "role": "system",
                        "content": prompt,
                    }
                ],
            )
            
            llm_response = response.choices[0].message.content
            return jsonify({"response": llm_response})
    
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        connection.close()

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
        hint = response.choices[0].message.content
        print(hint)
        return hint

    except Exception as e:
        return str(e)
    


@app.route('/execute-sql', methods=['POST'])
def execute_sql():

    data = request.json
    db = data.get('db', '')
    name = data.get('name', '')
    sql_query = data.get('sql', '')
    
    if not sql_query:
        return jsonify({"error": "SQL query is missing."})
    
    # log the query
    log_db_connection = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, db='campus_quest')
    try:
        with log_db_connection.cursor() as cursor:
            insert_query = "INSERT INTO queries (name, sql_query, executed_at) VALUES (%s, %s, %s)"
            executed_at = datetime.datetime.now()
            cursor.execute(insert_query, (name, sql_query, executed_at))
            log_db_connection.commit()
    finally:
        log_db_connection.close()

    connection = None
    try:
        connection = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, db=db)
        with connection.cursor() as cursor:
            sql_query = sql_query.strip()
            lin = sql_query.lower().find("limit") + 6
            lis = sql_query[lin:].lower().find(" ")
            if "limit" not in sql_query.lower():
                if sql_query[-1] == ";": sql_query = sql_query[:-1] + " LIMIT 100;"
                else: sql_query += " LIMIT 100"
            elif "limit" in sql_query.lower() and int(sql_query[lin:lis]) > 100:
                sql_query = sql_query.replace("limit", "LIMIT")
                sql_query = sql_query.replace(f"LIMIT {sql_query[lin:lis]}", "LIMIT 100")
            cursor.execute(sql_query)
            column_names = [col[0] for col in cursor.description]
            result = cursor.fetchall()
            connection.close()
            return jsonify({"columns": column_names, "rows": result})
    except Exception as e:
        error_message = str(e)
        hint = send_to_llm(error_message, sql_query)
        return jsonify({"error": error_message, "hint": hint})
    # finally:
    #     connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=3000, use_reloader=True)
