CREATE SCHEMA IF NOT EXISTS search_api;

CREATE TABLE IF NOT EXISTS search_api.hits (
    id         SERIAL PRIMARY KEY,
    score      NUMERIC(10, 1),
    hit_key    TEXT,       
    hit_url    TEXT,      
    title      TEXT,
    venue      TEXT,
    publisher  TEXT,
    year       INTEGER,
    type       TEXT,
    access     TEXT,
    key        TEXT,
    doi        TEXT,
    ee         TEXT,
    url        TEXT
);

CREATE TABLE IF NOT EXISTS search_api.authors (
    id SERIAL PRIMARY KEY,
    pid       TEXT, 
    name      TEXT  
);

CREATE TABLE IF NOT EXISTS search_api.hit_authors (
    hit_id     INTEGER NOT NULL REFERENCES search_api.hits(id),
    author_id  INTEGER NOT NULL REFERENCES search_api.authors(id),
    PRIMARY KEY (hit_id, author_id)
);
