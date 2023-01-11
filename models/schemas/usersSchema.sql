PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Users (
	id INTEGER PRIMARY KEY ASC,
	username VARCHAR(40),
	exerciseId INTEGER,

	FOREIGN KEY (exerciseId) REFERENCES Exercises(id)
);

CREATE TABLE IF NOT EXISTS Exercises (
	id INTEGER PRIMARY KEY ASC,
	duration INTEGER,
	description VARCHAR(255),
	date DATE
);
