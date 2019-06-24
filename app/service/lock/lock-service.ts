import { Logger } from '../logger/logger';

export class LockService {

    private locks: Map<string, boolean> = new Map<string, boolean>();

    /**
     * Return true if lock i acquired successfully
     */
    acquire(id: string, message?: string): boolean {
        if (message === undefined) {
            message = `Could not acquire lock ${id}, first release lock`;
        }
        if (this.locks.get(id) === true) {
            Logger.warn(message);
            return false;
        }
        return true;
    }

    release(id: string): void {
        this.locks.set(id, false);
    }

}
