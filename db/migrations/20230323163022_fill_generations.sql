-- migrate:up

INSERT INTO generations (id, name) VALUES
  (1,'PRIMERA'),
  (2,'SEGUNDA'),
  (3,'TERCERA'),
  (4,'CUARTA'),
  (5,'QUINTA'),
  (6,'SEXTA'),
  (7,'SEPTIMA');

-- migrate:down

DELETE FROM generations;