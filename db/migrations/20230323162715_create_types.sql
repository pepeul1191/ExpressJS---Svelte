-- migrate:up

CREATE TABLE types (
	id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name	VARCHAR(20)
);

-- migrate:down

DROP TABLE IF EXISTS types;
