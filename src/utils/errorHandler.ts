import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { http_Exception } from '../logger/extendHttp';
import logger from '../logger/logger';



export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const isProduction = process.env.NODE_ENV === 'production';

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    body: req.body,
    params: req.params,
    query: req.query,
  });



  if (err instanceof http_Exception) {
    // Handle known operational errors
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message
    });
  } 

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation error',
      errors: err.issues.map(error => ({
        field: error.path.join('.'), 
        message: error.message      
      })),
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: isProduction ? 'Internal server error' : err.message,
    ...(!isProduction && { stack: err.stack })
  });
};