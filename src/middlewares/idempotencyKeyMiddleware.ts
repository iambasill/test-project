import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../logger/exceptions';

declare global {
    namespace Express {
        interface Request {
            IdempotencyKey?: string
        }
    }
}

export const requireIdempotencyKey = async (req: Request, res: Response, next: NextFunction) => {
  const IdempotencyKey = req.header('IdempotencyKey');
  if (!IdempotencyKey) throw new BadRequestError("IdempotencyKey header is required");
    req.IdempotencyKey = IdempotencyKey;
    next();

};
