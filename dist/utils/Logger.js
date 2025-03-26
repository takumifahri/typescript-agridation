"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
// utils/logger.ts
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
// Create logs directory if it doesn't exist
const logDir = path_1.default.join(process.cwd(), 'logs');
// Configure Winston logger
exports.Logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json()),
    defaultMeta: { service: 'user-service' },
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'error.log'),
            level: 'error'
        }),
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'combined.log')
        }),
        // Write security-specific logs
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'security.log'),
            level: 'warn'
        })
    ]
});
// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    exports.Logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
// Extend logger with custom methods
exports.Logger.security = (info) => {
    exports.Logger.log(Object.assign({ level: 'warn', message: 'Security Event' }, info));
};
