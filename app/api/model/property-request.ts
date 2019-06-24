import { Request } from './request';

export class PropertyRequest extends Request {
    public static TYPE_NAME = 'property';

    public key: string;
    public value: string;
}
