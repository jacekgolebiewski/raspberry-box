import { LedState } from './led-state';
import { LedColor } from './led-color';
import { Request } from '../request';

export class LedRequest extends Request {
    public static TYPE_NAME = 'led';

    public color: LedColor;
    public state: LedState;

}
