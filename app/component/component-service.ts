import * as _ from 'lodash';
import { Container } from "typescript-ioc";
import { Component } from './component';
import { App } from '../app';

export class ComponentService {

    static initComponents(compontents: (new () => any)[]) {
        compontents.forEach(component => {
            if (component.name === 'ioc_wrapper') {
                component = component['__parent'];
            }
            ComponentService.get(component);
        })
    }

    static get(component: string | (new () => any)) {
        let name: string;
        if (typeof component === 'string') {
            name = component;
        } else if (!_.isNil(component['name'])) {
            name = component.name;
        } else {
            return undefined;
        }

        const componentType = Component.types[name];
        if (_.isNil(componentType)) {
            throw Error(`No component with name ${name} registered. Did you forget \'@Component.default\' decorator?`);
        }

        return Container.get(componentType);
    }

}
