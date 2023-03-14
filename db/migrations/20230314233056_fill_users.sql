

-- migrate:up

INSERT INTO users (id, user, password, email) VALUES
  (1, 'root', '123', 'root@gmail.com'),
  (2, 'demo', '123', 'demo@gmail.com');

-- migrate:down

TRUNCATE users;