-- migrate:up

CREATE TABLE users (
	id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name	VARCHAR(45),
  user	VARCHAR(45) NOT NULL,
  password	VARCHAR(45) NOT NULL,
	email	VARCHAR(45) NOT NULL,
  image_url VARCHAR(100) NOT NULL
);

-- migrate:down

DROP TABLE IF EXISTS users;
