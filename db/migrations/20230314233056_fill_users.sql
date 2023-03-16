

-- migrate:up

INSERT INTO users (id, user, name, password, email, image_url) VALUES
  (1, 'root', 'Carlos Tevez', '123', 'root@gmail.com', 'user_root.png'),
  (2, 'demo', 'Javier Saviola', '123', 'demo@gmail.com', 'user_demo.png');

-- migrate:down

DELETE FROM users;