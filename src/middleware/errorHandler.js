const { logger } = require('../utils/logger');
const { ZodError } = require('zod');
const { Prisma } = require('@prisma/client');

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: err.errors
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          status: 'error',
          message: 'Unique constraint violation'
        });
      case 'P2025':
        return res.status(404).json({
          status: 'error',
          message: 'Record not found'
        });
      default:
        return res.status(500).json({
          status: 'error',
          message: 'Database error'
        });
    }
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

module.exports = { errorHandler }; 