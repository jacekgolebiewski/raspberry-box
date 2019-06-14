import { ComponentService } from '../../../component/component-service';
import { GpioService } from './gpio-service';
import { expect } from 'chai';
import { GpioError } from './GpioError';
import { FunctionUtil } from '../../../shared/utils/function-util';
import { GpioType } from '../../../model/gpio-type';
import * as _ from 'lodash';
import { RpioMock } from './rpio-mock';

describe('GpioService', () => {
    let gpioService: GpioService;
    let rpioMock: RpioMock;

    before(() => {
        ComponentService.initComponents([GpioService]);
        gpioService = ComponentService.get(GpioService);
        rpioMock = ComponentService.get(RpioMock);
    });

    beforeEach(() => {
        gpioService['rpio'] = rpioMock;
        gpioService.closeAll();
    });

    it('should throw GpioError for not initalized gpio', () => {
        //expect
        expect(() => gpioService.read(4)).to.throw(GpioError);
        expect(() => gpioService.write(4, 1)).to.throw(GpioError);
        expect(() => gpioService.poll(4, FunctionUtil.empty)).to.throw(GpioError);
    });

    it('should throw GpioError for not existing gpio id on open', () => {
        //expect
        expect(() => gpioService.openIN(1)).to.throw(GpioError);
    });

    it('should throw GpioError on writing to input or reading and polling from output gpio', () => {
        //and
        gpioService.openIN(4);
        gpioService.openOUT(5);
        //expect
        expect(() => gpioService.write(4, 1)).to.throw(GpioError);
        expect(() => gpioService.read(5)).to.throw(GpioError);
        expect(() => gpioService.poll(5, FunctionUtil.empty)).to.throw(GpioError);
    });

    it('should open close existing gpio', () => {
        //given
        gpioService.openIN(4);
        //when
        gpioService.openOUT(4);
        //then
        expect(gpioService.gpios.length).eq(1);
    });

    it('should read gpio values', () => {
        //given
        gpioService['rpio'] = {
            open: (pin: number, mode: number) => {},
            read: (id) => {
                return id > 10 ? 1 : 0;
            }
        } as Rpio;
        //and
        gpioService.openIN(4);
        gpioService.openIN(13);
        //expect
        expect(gpioService.read(4)).eq(0);
        expect(gpioService.read(13)).eq(1);
    });

    it('should write gpio values', () => {
        //given
        let lastValue = 0;
        gpioService['rpio'] = {
            open: (pin: number, mode: number) => {},
            write: (id: number, value: number) => {
                lastValue = value;
            }
        } as Rpio;
        //and
        gpioService.openOUT(4);
        //when
        gpioService.write(4, 1);
        //expect
        expect(lastValue).eq(1);
    });

    it('should poll invoke callback', (done) => {
        //given
        let lastValue = 0;
        gpioService['rpio'] = {
            open: (pin: number, mode: number) => {},
            read: (pin: number) => {
                return pin === 4 ? 1 : 0;
            },
            poll: (id: number, cb:(val: any) => any) => {
                setTimeout(() => {cb && cb(4)}, 10);
            }
        } as Rpio;
        //and
        gpioService.openIN(4);
        //when
        gpioService.poll(4, (val) => {lastValue = val;});
        //expect
        setTimeout(() => {
            expect(lastValue).eq(1);
            done()
        }, 20)
    });

    it('should clearPoll call poll with undefined cb value', () => {
        //given
        let lastPollParamValue = undefined;
        gpioService['rpio'] = {
            open: (pin: number, mode: number) => {},
            read: (pin: number) => {},
            poll: (id: number, cb:(val: any) => any) => {
                lastPollParamValue = cb;
            }
        } as Rpio;
        //and
        gpioService.openIN(4);
        //when
        gpioService.poll(4, FunctionUtil.empty);
        //then
        expect(lastPollParamValue).not.undefined;
        //when
        gpioService.clearPoll(4);
        //then
        expect(lastPollParamValue).undefined;
    });

    it('should clear remove gpio from list', () => {
        //given
        gpioService.openIN(4);
        expect(() => gpioService.get(4, GpioType.IN)).not.to.throw(GpioError);
        //when
        gpioService.close(4);
        //then
        expect(() => gpioService.get(4, GpioType.IN)).to.throw(GpioError);
    });

    it('should gpio list be sorted', () => {
        //given
        gpioService.openIN(13);
        gpioService.openOUT(5);
        gpioService.openOUT(6);
        //expect
        expect(_.isEqual(gpioService.gpios, _.sortBy(gpioService.gpios, 'id'))).true;
    });

});