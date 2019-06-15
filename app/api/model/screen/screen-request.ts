import { Request } from '../request';

export class ScreenRequest extends Request {
    public static TYPE_NAME = 'screen';

    public matrix: Array<Array<number>>;

}
