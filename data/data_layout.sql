DROP TABLE IF EXISTS users, planet_votes;

CREATE TABLE users (
    id serial primary key,
    full_name varchar(50) NOT NULL,
    email varchar(50) NOT NULL UNIQUE,
    password varchar(150) NOT NULL
);

CREATE TABLE planet_votes (
    id serial primary key,
    planet_id integer,
    planet_name varchar,
    user_id integer NOT NULL ,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

