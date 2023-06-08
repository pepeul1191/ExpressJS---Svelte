-- migrate:up

CREATE TABLE users_pokemons (
	id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_id	INTEGER NOT NULL,
  pokemon_id	INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (pokemon_id) REFERENCES pokemons (id)
);

-- migrate:down

DROP TABLE IF EXISTS users_pokemons;
