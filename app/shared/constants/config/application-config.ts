import * as _ from 'lodash';
import { LogLevel } from "../log/log-level";
import { Environment } from '../environment';
import { ConfigKey } from './config-key';
import { EnvironmentUtil } from '../../utils/environment-util';

/**
 * Nie może mieć zależności do klasy Logger
 */
export class ApplicationConfig {

    // TODO jg: use port and host config
    private static readonly LOCALHOST_WEBAPP_URL = 'http://localhost:9001';
    private static readonly RASPBERRY_WEBAPP_URL = 'http://localhost:9001';

    private static props: { [key: string]: any } = {};
    private static initialized: boolean = false;

    private static init() {
        ApplicationConfig.props[ConfigKey.VERSION] = 'v1.0';
        ApplicationConfig.props[ConfigKey.LOG_LINE_LIMIT] = 200;
        ApplicationConfig.props[ConfigKey.DEFAULT_PORT] = 3000;
        ApplicationConfig.props[ConfigKey.RUNTIME_DATA_DIR] = '.runtime_data';

        if(EnvironmentUtil.currentEnvironment === Environment.DEV) {
            ApplicationConfig.props[ConfigKey.WEBAPP_URL] = this.LOCALHOST_WEBAPP_URL;
            ApplicationConfig.props[ConfigKey.LOG_LEVEL] = LogLevel.DEBUG;
        }
        if(EnvironmentUtil.currentEnvironment === Environment.RPI) {
            ApplicationConfig.props[ConfigKey.WEBAPP_URL] = this.RASPBERRY_WEBAPP_URL;
            ApplicationConfig.props[ConfigKey.LOG_LEVEL] = LogLevel.DEBUG;
        }
    }

    static get(key: ConfigKey) {
        if (!ApplicationConfig.initialized) {
            ApplicationConfig.init();
        }
        let value = ApplicationConfig.props[key];
        if (_.isNil(value)) {
            throw Error(`No property with key ${key}. Did you forget to add it to ApplicationConfig?`);
        }
        return ApplicationConfig.props[key];
    }

}
