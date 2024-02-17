import winston from 'winston';

const requestLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to log entries
        winston.format.printf(info => {
            // Customize the log message to stringify the JSON without backslashes
            const message = `${info.timestamp} - ${info.message}`;
            return message;
        })
    ),
    transports: [
        new winston.transports.File({ filename: 'req_url.txt' })
    ]
});

const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to log entries
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.txt' })
    ]
});

const requestLoggerMiddleware = (req, res, next) => {
    // Log request body
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;

    // Log to request logger
    if (!req.url.includes('signIn')) {
        requestLogger.info(logData);
    }

    // Error handling
    const originalSend = res.send;
    res.send = function (body) {
        originalSend.call(this, body);

        // Log error if status code is an error (4xx or 5xx)
        if (res.statusCode >= 400) {
            const errorLogData = `${req.url} - Status ${res.statusCode} - ${JSON.stringify(req.body)}`;
            errorLogger.error(errorLogData);
        }
    };

    next();
};

export { errorLogger, requestLoggerMiddleware };
