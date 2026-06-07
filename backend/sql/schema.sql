-- Run against database: futsal_booking --
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(100),
    role VARCHAR(100),
    location VARCHAR(100),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6)
);

CREATE TABLE IF NOT EXISTS futsal_venues (
    futsal_id SERIAL PRIMARY KEY,
    futsal_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    phone_number VARCHAR(100),
    -- Here we have made 'owner_id' is the foreign key which links two tables - users and futsal_venues. It references user_id because the logic behind this is an owner is also a user i.e. an owner can also book other futsals.
    owner_id INTEGER REFERENCES users(user_id),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6) 
);