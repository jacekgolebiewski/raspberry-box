import { Logger } from './logger';
import { expect } from 'chai';
import { LogLevel } from '../../shared/constants/log/log-level';

describe('Logger', () => {
    it('Correctly append prefix', () => {
        let result = Logger['appendPrefix'](LogLevel.INFO, 'test message');
        expect(result).to.contain('INFO: test message')
    });
});