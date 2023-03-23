-- migrate:up

INSERT INTO types (id, name) VALUES
    (1,'PLANTA'),
    (2,'VENENO'),
    (3,'FUEGO'),
    (4,'NINGUNO'),
    (5,'VOLADOR'),
    (6,'AGUA'),
    (7,'BICHO'),
    (8,'NORMAL'),
    (9,'ELÉCTRICO'),
    (10,'TIERRA'),
    (11,'HADA'),
    (12,'LUCHA'),
    (13,'PSÍQUICO'),
    (14,'ROCA'),
    (15,'ACERO'),
    (16,'HIELO'),
    (17,'FANTASMA'),
    (18,'DRAGÓN'),
    (19,'SINIESTRO');

-- migrate:down

DELETE FROM types;