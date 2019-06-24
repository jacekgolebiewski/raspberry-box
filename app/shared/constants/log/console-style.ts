export class ConsoleStyle {
    static Reset = new ConsoleStyle("\x1b[0m");
    static Bright = new ConsoleStyle("\x1b[1m");
    static Dim = new ConsoleStyle("\x1b[2m");
    static Underscore = new ConsoleStyle("\x1b[4m");
    static Blink = new ConsoleStyle("\x1b[5m");
    static Reverse = new ConsoleStyle("\x1b[7m");
    static Hidden = new ConsoleStyle("\x1b[8m");

    static FgBlack = new ConsoleStyle("\x1b[30m");
    static FgRed = new ConsoleStyle("\x1b[31m");
    static FgGreen = new ConsoleStyle("\x1b[32m");
    static FgYellow = new ConsoleStyle("\x1b[33m");
    static FgBlue = new ConsoleStyle("\x1b[34m");
    static FgMagenta = new ConsoleStyle("\x1b[35m");
    static FgCyan = new ConsoleStyle("\x1b[36m");
    static FgWhite = new ConsoleStyle("\x1b[37m");

    static BgBlack = new ConsoleStyle("\x1b[40m");
    static BgRed = new ConsoleStyle("\x1b[41m");
    static BgGreen = new ConsoleStyle("\x1b[42m");
    static BgYellow = new ConsoleStyle("\x1b[43m");
    static BgBlue = new ConsoleStyle("\x1b[44m");
    static BgMagenta = new ConsoleStyle("\x1b[45m");
    static BgCyan = new ConsoleStyle("\x1b[46m");
    static BgWhite = new ConsoleStyle("\x1b[47m");

    constructor(public value: string) {
    }
}