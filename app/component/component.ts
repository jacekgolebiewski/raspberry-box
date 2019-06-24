import { Singleton } from 'typescript-ioc';
import { Logger } from '../service/logger/logger';

export class Component {
    static types: { [key: string]: any } = {};

    static default(target: Function): any {
        return Component.init(target);
    }

    private static init(target: Function) {
        let component = Component.wrapWithLogger(target);
        Component.types[component.name] = component;
        Singleton(component);
        return component;
    }

    private static wrapWithLogger(target: Function) {
        return new Proxy(target, {
            construct(clz, args) {
                Logger.debug(`Component ${target.name} created`);
                return Reflect.construct(clz, args);
            }
        });
    }

}