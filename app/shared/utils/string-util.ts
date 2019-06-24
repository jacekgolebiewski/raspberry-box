import * as util from 'util';

export class StringUtil {

    static stringify(obj: any): string {
        return util.inspect(obj, { compact: false, depth: 2});
    }

}