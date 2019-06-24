export class RandomUtil {

    static getRandom(range: number, offset: number = 0) {
        return new Date().getTime()%(range-offset)+offset;
    }

}