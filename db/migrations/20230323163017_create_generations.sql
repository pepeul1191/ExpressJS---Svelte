-- migrate:up

CREATE TABLE generations (
	id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name	VARCHAR(20)
);

-- migrate:down

DROP TABLE IF EXISTS generations;
