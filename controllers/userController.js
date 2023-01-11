import Users from '../models/users.js';
import { getTodayISO, sendErrorResponse } from '../utils/index.js';

const controller = {};

controller.getUsers = async (req, res) => {
  try {
    const users = await Users.all(
      'SELECT id, username FROM Users ORDER BY id ASC'
    );
    res.json(users);
  } catch (err) {
    sendErrorResponse(err, res);
  }
};

controller.getUserLogs = async (req, res) => {
  const userId = +req.params.id;
  const { from, to, limit } = req.query;

  try {
    const user = await Users.get(
      'SELECT username FROM Users WHERE id = ?',
      userId
    );
    let exercises = await Users.all(
      'SELECT id, description, duration, date FROM Exercises WHERE userId = ? ORDER BY id ASC',
      userId
    );
    const exerciseCount = exercises.length;

    if (from) exercises = exercises.filter(e => e.date >= from);
    if (to) exercises = exercises.filter(e => e.date < to);
    if (limit) exercises = exercises.slice(0, limit);

    const payload = {
      id: userId,
      username: user.username,
      count: exerciseCount,
      log: exercises,
    };
    res.json(payload);
  } catch (err) {
    sendErrorResponse(err, res);
  }
};

controller.createUser = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await Users.run(
      'INSERT INTO Users (username) VALUES (?)',
      username
    );
    const payload = { id: user.lastID, username };
    res.status(201).json(payload);
  } catch (err) {
    sendErrorResponse(err, res);
  }
};

controller.createUserExercise = async (req, res) => {
  const userId = +req.params.id;
  const { description, duration } = req.body;
  const date = req.body.date || getTodayISO();

  try {
    const exercise = await Users.run(
      'INSERT INTO Exercises (userId,description,duration,date) VALUES (?,?,?,?)',
      userId,
      description,
      duration,
      date
    );

    const payload = {
      exerciseId: exercise.lastID,
      userId,
      description,
      duration,
      date,
    };
    res.status(201).json(payload);
  } catch (err) {
    sendErrorResponse(err, res);
  }
};

export default controller;
