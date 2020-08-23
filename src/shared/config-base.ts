import * as dotenv from "dotenv";
import * as fs from "fs";

export abstract class ConfigBase {

    private envConfig: { [key: string]: string };
    private envScope: string = 'development';

    private read () {
        this.envConfig = dotenv.parse(fs.readFileSync(this.envScope.length ? `.env.${ this.envScope }` : '.env'));
    }

    abstract init (): void;

    constructor (instance?: any) {
        if (instance) return instance;
        if(process.env.hasOwnProperty('NODE_ENV')) this.envScope = process.env.NODE_ENV!.toLowerCase();
        this.read();
        this.init();
    }

    env (key: string, defaultValue: any = undefined): string {
        return this.envConfig.hasOwnProperty(key) ? this.envConfig[key] : defaultValue;
    }

}
