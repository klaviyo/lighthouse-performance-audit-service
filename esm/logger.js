import winston from 'winston';
let logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production'
        ? winston.format.json()
        : winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.simple()),
    defaultMeta: { service: 'lighthouse-audit-service' },
    transports: [
        new winston.transports.Console({
            silent: process.env.JEST_WORKER_ID !== undefined && !process.env.LOG_LEVEL,
        }),
    ],
});
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
    logger.add(new winston.transports.File({ filename: 'combined.log' }));
}
export function setLogger(newLogger) {
    logger = newLogger;
}
export default logger;
//# sourceMappingURL=logger.js.map