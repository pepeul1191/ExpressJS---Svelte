-- migrate:up

CREATE TABLE pokemons (
	id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name	VARCHAR(45),
  number	INTEGER NOT NULL,
  weight	FLOAT NOT NULL,
	height	FLOAT NOT NULL,
  image_url VARCHAR(100) NOT NULL,
  generation_id	INTEGER NOT NULL,
  FOREIGN KEY (generation_id) REFERENCES generations (id)
);

-- migrate:down

DROP TABLE IF EXISTS pokemons;
