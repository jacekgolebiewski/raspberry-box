import { LogLevel } from "../../shared/constants/log/log-level";
import { ConsoleStyle } from "../../shared/constants/log/console-style";
import { ApplicationConfig } from '../../shared/constants/config/application-config';
import * as _ from 'lodash';
import { ConfigKey } from '../../shared/constants/config/config-key';

/**
 * Nie może być komponentem
 */
export class Logger {
    private static readonly LOG_LIMIT_CUT_SUFFIX = '[...]';
    private static LOG_LEVEL: LogLevel = ApplicationConfig.get(ConfigKey.LOG_LEVEL);
    private static LOG_LINE_LIMIT: number = ApplicationConfig.get(ConfigKey.LOG_LINE_LIMIT);

    private static log(message: string, level: LogLevel, data?: any) {
        if (Logger.LOG_LEVEL.order < level.order) {
            return;
        }

        message = this.appendPrefix(level, message);
        message = this.injectData(message, data);
        message = this.cutToLimit(message);
        message = this.applyLogStyles(level, message);

        console.log(message);
    };

    private static appendPrefix(level: LogLevel, message: string) {
        return level.prefix + ": " + message;
    }

    private static injectData(message: string, data: any) {
        if (_.isNil(data)) {
            return message.replace('{}', '');
        }
        return message.replace('{}', JSON.stringify(data));
    }

    private static cutToLimit(message: string): string {
        if (message.length <= Logger.LOG_LINE_LIMIT) {
            return message;
        }
        return message.slice(0, Logger.LOG_LINE_LIMIT - Logger.LOG_LIMIT_CUT_SUFFIX.length)
            + Logger.LOG_LIMIT_CUT_SUFFIX;
    }

    private static applyLogStyles(level: LogLevel, message: string): string {
        if (level.styles.length == 0) {
            return message
        }

        let messageStyles = level.styles
            .map(style => style.value)
            .reduce(((previousValue, currentValue) => {
                return previousValue + currentValue;
            }));

        return messageStyles + message + ConsoleStyle.Reset.value;
    }

    static critical(message: string, data?) {
        return Logger.log(message, LogLevel.CRITICAL, data);
    };

    static error(message: string, data?) {
        return Logger.log(message, LogLevel.ERROR, data);
    };

    static warn(message: string, data?) {
        return Logger.log(message, LogLevel.WARN, data);
    };

    static info(message: string, data?) {
        return Logger.log(message, LogLevel.INFO, data);
    };

    static debug(message: string, data?) {
        return Logger.log(message, LogLevel.DEBUG, data);
    };

    static trace(message: string, data?) {
        return Logger.log(message, LogLevel.TRACE, data);
    };

}