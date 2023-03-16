CREATE TABLE IF NOT EXISTS "schema_migrations" (version varchar(255) primary key);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE users (
	id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name	VARCHAR(45),
  user	VARCHAR(45) NOT NULL,
  password	VARCHAR(45) NOT NULL,
	email	VARCHAR(45) NOT NULL,
  image_url VARCHAR(100) NOT NULL
);
-- Dbmate schema migrations
INSERT INTO "schema_migrations" (version) VALUES
  ('20230314232509'),
  ('20230314233056');
