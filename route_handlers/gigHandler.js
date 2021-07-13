// Load Idea Model
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const pool = require('../models/db');
const { createUser } = require('../models/User');
var validator = require('validator');
const { check, validationResult } = require('express-validator');

exports.viewGigs = (req, res) => {
  console.log('These are gigs');
  res.status(201).send('these are gigs');
};

exports.test = async (req, res) => {
  await pool.query('SELECT NOW()', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

exports.allUsers = catchAsync(async (req, res, next) => {
  const users = await pool.query(
    'SELECT * FROM systemuser',
    (error, results) => {
      if (error) {
        return next(new AppError('Error retrieving users', 400));
      }
      res.status(200).json(results.rows);
    }
  );
});

exports.oneUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const users = await pool.query(
    'SELECT * FROM systemuser WHERE userid = $1',
    [id],
    (error, results) => {
      if (error) {
        return next(new AppError('Error retrieving user', 400));
      }
      res.status(200).json(results.rows);
    }
  );
});

exports.createUser = async (req, res, next) => {
  const value = await createUser(req, res, next);

  if (value === 'error') return next(new AppError('Error inserting user', 400)); // TODO -  handle error
  res.status(200).json(value);
};
