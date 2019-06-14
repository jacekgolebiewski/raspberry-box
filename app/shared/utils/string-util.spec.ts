import { expect } from "chai";
import { StringUtil } from './string-util';

describe('StringUtil', () => {

    it('should return [empty] for empty object or undefined', () => {
        //expect
        expect(StringUtil.stringify(undefined)).eq('undefined');
        expect(StringUtil.stringify(null)).eq('null');
        expect(StringUtil.stringify({})).eq('{}');
    });

});