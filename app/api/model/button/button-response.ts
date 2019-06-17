import { Response } from '../response';
import { Button } from './button';
import { ButtonAction } from './button-action';

export class ButtonResponse extends Response {
    public type = 'button';

    constructor(public button: Button,
                public action: ButtonAction) {
        super();
    }


}
