import os
import requests
import psycopg2

DB_NAME = os.getenv("POSTGRES_DB", "testdb")
DB_USER = os.getenv("POSTGRES_USER", "toto")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "1234")
DB_HOST = os.getenv("DB_HOST", "db")  # Use 'db' as the hostname inside Docker
DB_PORT = os.getenv("DB_PORT", "5433")

API_URL = "https://dblp.org/search/publ/api?q=data&h=100&format=json"

res = requests.get(API_URL)
data = res.json()

conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cur = conn.cursor()

def insert_hit(hit):
    cur.execute("""
        INSERT INTO search_api.hits (
            score, 
            hit_key, 
            hit_url, 
            title, 
            venue, 
            publisher, 
            year, 
            type, 
            access, 
            key, 
            doi, 
            ee, 
            url
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        hit.get('@score'),
        hit.get('info', {}).get('key'),     
        hit.get('url'),                  
        hit.get('info', {}).get('title'),
        hit.get('info', {}).get('venue'),
        hit.get('info', {}).get('publisher'),
        hit.get('info', {}).get('year'),
        hit.get('info', {}).get('type'),
        hit.get('info', {}).get('access'),
        hit.get('info', {}).get('key'),
        hit.get('info', {}).get('doi'),
        hit.get('info', {}).get('ee'),
        hit.get('info', {}).get('url'),
    ))
    return cur.fetchone()[0]

def insert_author(author):
    pid = author.get("@pid")
    name = author.get("text")
    if not pid:
        return None

    cur.execute("SELECT id FROM search_api.authors WHERE pid = %s", (pid,))
    existing = cur.fetchone()
    if existing:
        return existing[0]

    cur.execute("""
        INSERT INTO search_api.authors (pid, name)
        VALUES (%s, %s)
        RETURNING id
    """, (pid, name))
    return cur.fetchone()[0]

def insert_hit_authors(hit_id, author_id):
    if author_id is None:
        return
    cur.execute("""
        INSERT INTO search_api.hit_authors (hit_id, author_id)
        VALUES (%s, %s)
    """, (hit_id, author_id))

def populate_database():
    hits = data.get("result", {}).get("hits", {}).get("hit", [])
    if not hits:
        print("Aucun résultat à insérer.")
    else:
        for hit in hits:
            hit_id = insert_hit(hit)

            authors = hit.get("info", {}).get("authors", {}).get("author", [])
            if isinstance(authors, dict):
                authors = [authors]

            for author in authors:
                author_id = insert_author(author)
                insert_hit_authors(hit_id, author_id)

    conn.commit()
    cur.close()
    conn.close()
    print("Import terminé avec succès.")

if __name__ == "__main__":
    populate_database()
