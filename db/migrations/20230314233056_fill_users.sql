-- migrate:up

INSERT INTO users (id, user, name, password, email, image_url) VALUES
  (1, "admin", "Super Administrador", "123", "root@ulima.edu.pe", "https://pokefanaticos.com/pokedex/assets/images/pokemon_imagenes/1.png"),
  (2, "pepe", "Pepe Valdivia", "123", "pepe@ulima.edu.pe", "https://pokefanaticos.com/pokedex/assets/images/pokemon_imagenes/2.png"),
  (3, "sila", "Sila Esculapia", "123", "sila@ulima.edu.pe", "https://pokefanaticos.com/pokedex/assets/images/pokemon_imagenes/3.png"),
  (4, "mateo", "Mateo Sanchez", "123", "mateo@ulima.edu.pe", "https://pokefanaticos.com/pokedex/assets/images/pokemon_imagenes/4.png"),
  (5, "marcos", "Marcos Perez", "123", "marcos@ulima.edu.pe", "https://pokefanaticos.com/pokedex/assets/images/pokemon_imagenes/5.png"),
  (6, "lucas", "Lucas Moura", "123", "lucas@ulima.edu.pe", "https://pokefanaticos.com/pokedex/assets/images/pokemon_imagenes/6.png"),
  (7, "juan", "Juan Vargas", "123", "juan@ulima.edu.pe", "https://pokefanaticos.com/pokedex/assets/images/pokemon_imagenes/7.png"),
  (8, "judas", "Judas Iscariote", "123", "judas@ulima.edu.pe", "https://pokefanaticos.com/pokedex/assets/images/pokemon_imagenes/8.png"),
  (9, "tito", "Tito Garcia", "123", "tito@ulima.edu.pe", "https://pokefanaticos.com/pokedex/assets/images/pokemon_imagenes/9.png"),
  (10, "filemon", "Filemon Peluche", "123", "filemon@ulima.edu.pe", "https://pokefanaticos.com/pokedex/assets/images/pokemon_imagenes/9.png");

-- migrate:down

DELETE FROM users;