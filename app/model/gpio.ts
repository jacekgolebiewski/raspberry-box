import { GpioType } from "./gpio-type";

export class Gpio {
    constructor(
      public id: number,
      public type: GpioType,
      public value: number = 0
    ){}
}
