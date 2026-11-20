CREATE DATABASE IF NOT EXISTS futsal_hub;
USE futsal_hub;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  role ENUM('player','owner') NOT NULL DEFAULT 'player',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE futsals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  address VARCHAR(200),
  lat DECIMAL(9,6) NOT NULL DEFAULT 27.700000,
  lng DECIMAL(9,6) NOT NULL DEFAULT 85.333300,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- one price per weekday; dow 0 = Sunday ... 6 = Saturday
CREATE TABLE pricing (
  futsal_id INT NOT NULL,
  dow TINYINT NOT NULL,
  price INT NOT NULL,
  PRIMARY KEY (futsal_id, dow),
  FOREIGN KEY (futsal_id) REFERENCES futsals(id) ON DELETE CASCADE
);

-- UNIQUE key makes double booking impossible at the database level
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  futsal_id INT NOT NULL,
  user_id INT NOT NULL,
  play_date DATE NOT NULL,
  start_hour TINYINT NOT NULL,
  price INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_slot (futsal_id, play_date, start_hour),
  FOREIGN KEY (futsal_id) REFERENCES futsals(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
