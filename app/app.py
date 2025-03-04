from flask import Flask, jsonify, render_template
import psycopg2
import os

app = Flask(__name__, template_folder="/app/site")

# Database connection settings
DB_NAME = os.getenv("POSTGRES_DB", "testdb")
DB_USER = os.getenv("POSTGRES_USER", "toto")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "1234")
DB_HOST = os.getenv("DB_HOST", "db")  
DB_PORT = os.getenv("DB_PORT", "5433")

# Connect to PostgreSQL
def get_db_connection():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )

# API endpoint to get all records
@app.route("/api/hits", methods=["GET"])
def get_hits():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM search_api.hits;")
    hits = cur.fetchall()

    results = []
    for hit in hits:
        results.append({
            "id": hit[0],
            "score": hit[1],
            "hit_key": hit[2],
            "hit_url": hit[3],
            "title": hit[4],
            "venue": hit[5],
            "publisher": hit[6],
            "year": hit[7],
            "type": hit[8],
            "access": hit[9],
            "key": hit[10],
            "doi": hit[11],
            "ee": hit[12],
            "url": hit[13]
        })

    cur.close()
    conn.close()

    return jsonify(results)

# Fix: Keep only this route for "/"
@app.route("/")
def home():
    return render_template("index.html")  # Serve the frontend

if __name__ == "__main__":
    print("Process started")
    exec(open('/app/populate.py').read())
    app.run(host="0.0.0.0", port=8000, debug=True)
