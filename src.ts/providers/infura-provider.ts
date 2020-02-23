'use strict';

import { JsonRpcProvider, JsonRpcSigner } from './json-rpc-provider';

import { getNetwork } from '../utils/networks';
import { defineReadOnly } from '../utils/properties';

// Imported Types
import { Networkish } from '../utils/networks';

import * as errors from '../errors';

export class InfuraProvider extends JsonRpcProvider {
    readonly apiAccessToken: string;

    constructor(network?: Networkish, apiAccessToken?: string) {
        network = getNetwork((network == null) ? 'homestead': network);

        var host = null;
        switch(network.name) {
            case 'homestead':
                host = 'api.pungo.cloud/infura';
                break;
            case 'ropsten':
                host = 'ropsten.infura.io/v3/a3ed7563e19c456e876d9c6c95d49648';
                break;
            case 'rinkeby':
                host = 'rinkeby.infura.io/v3/a3ed7563e19c456e876d9c6c95d49648';
                break;
            case 'kovan':
                host = 'kovan.infura.io/v3/a3ed7563e19c456e876d9c6c95d49648';
                break;
            default:
                throw new Error('unsupported network');
        }

        super('https://' + host + '/' + (apiAccessToken || ''), network);
        errors.checkNew(this, InfuraProvider);

        defineReadOnly(this, 'apiAccessToken', apiAccessToken || null);
    }

    protected _startPending(): void {
        console.log('WARNING: INFURA does not support pending filters');
    }

    getSigner(address?: string): JsonRpcSigner {
        errors.throwError(
            'INFURA does not support signing',
            errors.UNSUPPORTED_OPERATION,
            { operation: 'getSigner' }
        );
        return null;
    }

    listAccounts(): Promise<Array<string>> {
        return Promise.resolve([]);
    }
}
