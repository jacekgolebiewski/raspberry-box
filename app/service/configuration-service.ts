import { Component } from '../component/component';
import { Logger } from './logger/logger';

@Component.default
export class ConfigurationService {

    setProperty(key: string, value: string) {
        Logger.debug(`Setting property: ${key}=${value}`);
    }

}
