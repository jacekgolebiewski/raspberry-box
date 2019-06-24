import { Environment } from '../constants/environment';
import { NodeUtil } from './node-util';

export class EnvironmentUtil {
    private static GPIO_LIB_NAME = 'rpi-gpio';
    private static _env: Environment;

    static get currentEnvironment(): Environment {
        if (!EnvironmentUtil._env) {
            EnvironmentUtil._env = NodeUtil.libExists(this.GPIO_LIB_NAME) ? Environment.RPI : Environment.DEV;
        }
        return EnvironmentUtil._env;
    };

    static isProduction() {
        return Environment.RPI == this.currentEnvironment;
    }

}
