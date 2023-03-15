

-- migrate:up

INSERT INTO users (id, user, password, email, image_url) VALUES
  (1, 'root', '123', 'root@gmail.com', 'user_root.png'),
  (2, 'demo', '123', 'demo@gmail.com', 'user_demo.png');

-- migrate:down

DELETE FROM users;