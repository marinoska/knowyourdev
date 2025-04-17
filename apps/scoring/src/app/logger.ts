import winston from "winston";
import { v4 } from "uuid";

// import  'winston-daily-rotate-file';

const {
    LOGGER_FILE,
    LOGGER_LEVEL
} = process.env;

if (!LOGGER_FILE) throw new Error('Empty LOGGER_FILE in env');
//
const loggerFile = `${LOGGER_FILE}`;

const formatter = ({error, ...logEntry}: any) => {
    const enhanced = {
        ...logEntry,
        timestamp: new Date().toISOString(),
        // loggerName: `ingesting`,
        uuid: v4()
    };

    if (error instanceof Error) {
        enhanced.error = error;
        enhanced.message += error.toString();
        // @ts-ignore
        enhanced.code = error.code;
    }

    return enhanced;
};

const logger = winston.createLogger({
    format: winston.format.combine(winston.format(formatter)(), winston.format.json()),
    transports: [
        new winston.transports.Console({
            level: LOGGER_LEVEL
        })
    ],
    // exceptionHandlers: [
    //   new winston.transports.Console({ level: 'error' }),
    //   new winston.transports.File({
    //     filename: `${loggerFile}-exceptions.log`,
    //     level: LOGGER_LEVEL
    //   })
    // ]
});

// if (LOGGER_FILE) {
//   logger.add(
//     new winston.transports.DailyRotateFile({
//       filename: `${loggerFile}-%DATE%.log`,
//       datePattern: 'YYYY-MM-DD',
//       // zippedArchive: true,
//       maxSize: '10m',
//       maxFiles: '7d'
//     })
//   );
// }

function create(name: string) {
    function format(level: 'error' | 'warn' | 'info' | 'debug', logText: string, error?: any) {

        const message = `${name}: ${logText}`;

        if (error instanceof Error) {
            logger.log({
                level,
                message,
                error
            });

            return;
        }

        logger[level](message, error);
    }

    return {
        debug(message: string, error?: any) {
            format('debug', message, error);
        },
        info(message: string, error?: any) {
            format('info', message, error);
        },
        warn(message: string, error?: any) {
            format('warn', message, error);
        },
        error(message: string, error?: any) {
            format('error', message, error);
        }
    };
}

export default create;
