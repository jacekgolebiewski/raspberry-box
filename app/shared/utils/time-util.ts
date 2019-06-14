export class TimeUtil {

    /**
     * Wait specified time in millis
     * @param timeInMillis float number of millis
     * @returns {number} time actually waited
     */
    static waitMillis(timeInMillis: number): number {
        const NS_PER_SEC = 1e9;
        const getMillis = function(hrt) {
            return Math.floor((hrt[0] * NS_PER_SEC + hrt[1])/1000)/1000;
        };

        const start = process.hrtime();
        let diff;
        while((diff=getMillis(process.hrtime(start)))<timeInMillis) {
            ; //waiting
        }
        return diff;
    }

    static minutesToMilis(minutes: number) {
        return 1000 * 60 * minutes;
    }

}