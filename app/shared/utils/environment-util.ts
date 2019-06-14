import { Environment } from '../constants/environment';
import { NodeUtil } from './node-util';

export class EnvironmentUtil {
    private static RPIO_LIB_NAME = 'rpio';
    private static _env: Environment;

    static get currentEnvironment(): Environment {
        if (!EnvironmentUtil._env) {
            EnvironmentUtil._env = NodeUtil.libExists(this.RPIO_LIB_NAME) ? Environment.RPI : Environment.DEV;
        }
        return EnvironmentUtil._env;
    };

    static isProduction() {
        return Environment.RPI == this.currentEnvironment;
    }

}