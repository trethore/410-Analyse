import os
import requests
from pymongo import MongoClient

def fetch_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  
        return response.json()
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def store_data_in_mongodb(data, collection_name="documents"):
    try:
        mongo_uri = os.environ.get("DATABASE_URL", "mongodb://localhost:27017/")
        client = MongoClient(mongo_uri)
        db = client.get_default_database()
        collection = db[collection_name]
        
        if "docs" in data:
            docs = data["docs"]
        elif "response" in data and "docs" in data["response"]:
            docs = data["response"]["docs"]
        else:
            print("No documents found in the data.")
            return
        
        if docs:
            
            result = collection.insert_many(docs)
            print(f"Inserted {len(result.inserted_ids)} documents into MongoDB.")
        else:
            print("No documents to insert.")
    except Exception as e:
        print(f"Error storing data in MongoDB: {e}")

if __name__ == "__main__":
    url = ("https://api.archives-ouvertes.fr/search/"
           "?q=structCountry_s:fr&wt=json&fl=authFullName_s,producedDateY_i,"
           "publisher_s,docid,uri_s,title_s,fileMain_s,labStructAcronym_s,page_s,"
           "structCountry_s,city_s,labStructAddress_s&rows=1000")
    
    data = fetch_data(url)
    if data:
        store_data_in_mongodb(data)
