import { Request, Response, NextFunction } from 'express';

export const getRequestLogger = () => {
  return function (req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();

    res.on('finish', () => {
      const endedAt = Date.now();
      const responseTime = endedAt - startedAt;

      if (!req.originalUrl.match('healthcheck')) {
        console.log({
          requestMethod: req.method,
          requestUrl: req.originalUrl,
          responseTime,
          statusCode: res.statusCode,
          userId: req.user?.userId
        });
      }
    });

    next();
  };
};
