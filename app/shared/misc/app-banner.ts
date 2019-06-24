import { ConsoleStyle } from '../constants/log/console-style';

export class AppBanner {
    static getTitle() {
        return "\n" + ConsoleStyle.FgRed.value +
            "\n" +
            "______                _                         ______           \n" +
            "| ___ \\              | |                        | ___ \\          \n" +
            "| |_/ /__ _ ___ _ __ | |__   ___ _ __ _ __ _   _| |_/ / _____  __\n" +
            "|    // _` / __| '_ \\| '_ \\ / _ \\ '__| '__| | | | ___ \\/ _ \\ \\/ /\n" +
            "| |\\ \\ (_| \\__ \\ |_) | |_) |  __/ |  | |  | |_| | |_/ / (_) >  < \n" +
            "\\_| \\_\\__,_|___/ .__/|_.__/ \\___|_|  |_|   \\__, \\____/ \\___/_/\\_\\\n" +
            "               | |                          __/ |                \n" +
            "               |_|                         |___/                 \n\n" +
            ConsoleStyle.Reset.value;
    }

    static printTitle() {
        console.log(this.getTitle());
    }
}
