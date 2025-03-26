// utils/logger.ts
import path from "path";
import winston from "winston";

// Extend winston.Logger interface to include the custom 'security' method
declare module "winston" {
    interface Logger {
        security(info: any): void;
    }
}

// Create logs directory if it doesn't exist
const logDir = path.join(process.cwd(), 'logs');

// Configure Winston logger
export const Logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.File({ 
            filename: path.join(logDir, 'error.log'), 
            level: 'error' 
        }),
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston.transports.File({ 
            filename: path.join(logDir, 'combined.log') 
        }),
        // Write security-specific logs
        new winston.transports.File({ 
            filename: path.join(logDir, 'security.log'),
            level: 'warn'
        })
    ]
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    Logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Extend logger with custom methods
Logger.security = (info: any) => {
    Logger.log({
        level: 'warn',
        message: 'Security Event',
        ...info
    });
};