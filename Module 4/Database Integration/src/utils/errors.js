class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

function normalizePrismaError(error) {
  if (!error) return error;

  if (error instanceof AppError) {
    return error;
  }

  switch (error.code) {
    case 'P2002':
      return new AppError('A record with the same unique value already exists.', 409);
    case 'P2003':
      return new AppError('The requested relationship is invalid.', 422);
    case 'P2025':
      return new AppError('The requested record was not found.', 404);
    default:
      return error;
  }
}

module.exports = { AppError, normalizePrismaError };
