import { Logger } from "../../logger/logger";
import { Component } from '../../../component/component';

@Component.default
export class RpioMock implements Rpio {

    // values may be different than in real Rpio
    HIGH: number = 1;
    INPUT: number = 0;
    LOW: number = 0;
    OUTPUT: number = 1;
    PAD_DRIVE_10mA: number;
    PAD_DRIVE_12mA: number;
    PAD_DRIVE_14mA: number;
    PAD_DRIVE_16mA: number;
    PAD_DRIVE_2mA: number;
    PAD_DRIVE_4mA: number;
    PAD_DRIVE_6mA: number;
    PAD_DRIVE_8mA: number;
    PAD_GROUP_0_27: number;
    PAD_GROUP_28_45: number;
    PAD_GROUP_46_53: number;
    PAD_HYSTERESIS: number;
    PAD_SLEW_UNLIMITED: number;
    POLL_BOTH: number;
    POLL_HIGH: number;
    POLL_LOW: number;
    PULL_DOWN: number;
    PULL_OFF: number;
    PULL_UP: number;
    PWM: number;

    close(pin: number): void {
        this.logFnExecuted(`close(pin: ${pin})`);
    }

    i2cBegin(): void {
    }

    i2cEnd(): void {
    }

    i2cRead(buffer: Buffer, length?: number): void {
    }

    i2cSetBaudRate(baudRate: number): void {
    }

    i2cSetClockDivider(clockDivider: number): void {
    }

    i2cSetSlaveAddress(address: number): void {
    }

    i2cWrite(biffer: Buffer, length?: number): void {
    }

    init(options: RPIO.Options): void {
    }

    mode(pin: number, mode: number): void {
    }

    msleep(n: number): void {
    }

    open(pin: number, mode: number, options?: number): void {
        this.logFnExecuted(`open(pin: ${pin}, mode: ${mode})`);
    }

    poll(pin: number, cb: RPIO.CallbackFunction | null, direction?: number): void {
        this.logFnExecuted(`poll(pin: ${pin})`);
    }

    pud(pin: number, state: number): void {
    }

    pwmSetClockDivider(clockDivider: number): void {
        this.logFnExecuted(`pwmSetClockDivider(clockDivider: ${clockDivider})`);
    }

    pwmSetData(pin: number, data: number): void {
        this.logFnExecuted(`pwmSetData(pin: ${pin}, data: ${data})`);
    }

    pwmSetRange(pin: number, range: number): void {
        this.logFnExecuted(`pwmSetRange(pin: ${pin}, range: ${range})`);
    }

    read(pin: number): number {
        this.logFnExecuted(`read(pin: ${pin})`);
        return 0;
    }

    readbuf(pin: number, buffer: Buffer, length?: number): void {
    }

    readpad(group: number): number {
        return 0;
    }

    sleep(n: number): void {
        this.logFnExecuted(`sleep(n: ${n})`);
    }

    spiBegin(): void {
    }

    spiChipSelect(cePin: number): void {
    }

    spiEnd(): void {
    }

    spiSetCSPolarity(cePin: number, polarity: number): void {
    }

    spiSetClockDivider(clockDivider: number): void {
    }

    spiTransfer(txBuffer: Buffer, rxBuffer: Buffer, txLength: number): void {
    }

    spiWrite(txBuffer: Buffer, txLength: number): void {
    }

    usleep(n: number): void {
        this.logFnExecuted(`usleep(n: ${n})`);
    }

    write(pin: number, value: number): void {
        this.logFnExecuted(`write(pin: ${pin}, value: ${value})`);
    }

    writebuf(pin: number, buffer: Buffer, length?: number): void {
    }

    writepad(group: number, control: number): void {
    }

    logFnExecuted(callerName: string) {
        Logger.info(`Executed RpioMock.${callerName}`);
    }

}