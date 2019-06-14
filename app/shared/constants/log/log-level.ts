import { ConsoleStyle } from "./console-style";

export class LogLevel {

    static CRITICAL = new LogLevel(0, 'CRITICAL', [ConsoleStyle.Underscore, ConsoleStyle.FgMagenta]);
    static ERROR = new LogLevel(1, 'ERROR', [ConsoleStyle.FgRed]);
    static WARN = new LogLevel(2, 'WARN', [ConsoleStyle.FgYellow]);
    static INFO = new LogLevel(3, 'INFO', []);
    static DEBUG = new LogLevel(4, 'DEBUG', [ConsoleStyle.Dim]);
    static TRACE = new LogLevel(5, 'TRACE', [ConsoleStyle.FgCyan]);

    static LEVEL_LIST: Array<LogLevel> = [
        LogLevel.CRITICAL, LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG, LogLevel.TRACE
    ];

    constructor(public order: number,
                public prefix: string,
                public styles: Array<ConsoleStyle>) {}

}