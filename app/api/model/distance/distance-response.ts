import { Response } from '../response';

export class DistanceResponse extends Response {
    public type = 'distance';

    constructor(public distance: number) {
        super();
    }


}
