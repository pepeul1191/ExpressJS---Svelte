-- migrate:up

CREATE TABLE users_followers (
	id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_id	INTEGER NOT NULL,
  follower_id	INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (follower_id) REFERENCES users (id)
);

-- migrate:down

DROP TABLE IF EXISTS users_followers;
