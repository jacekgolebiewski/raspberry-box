import { ConsoleStyle } from '../constants/log/console-style';

export class AppBanner {
    static getTitle() {
        return "\n" + ConsoleStyle.FgRed.value +
            " BANNER \n" +
            ConsoleStyle.Reset.value;
    }

    static printTitle() {
        console.log(this.getTitle());
    }
}
