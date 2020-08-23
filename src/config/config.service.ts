import { Injectable } from '@nestjs/common';
import { Config } from './config';

@Injectable()
export class ConfigService extends Config {

    constructor (config: Config) {
        super(config);
    }

}
