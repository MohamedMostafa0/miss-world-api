import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { DatabaseConfig } from './database.config';
import { Logger } from '@nestjs/common';

export class Config {

    private envConfig: { [key: string]: string };

    private envScope: string = 'dev';

    jwt: {
        secret: string;
        expiresIn: string;
    };
    api: {
        port: number;
        host: string;
        version: string;
        path: string;
    };
    assetsPath: string;
    avatarAssetsUrl: string;
    cryptoMineAssetsUrl: string;
    influencerMaterialsDownloadPath: string;

    databases: { [alias: string]: DatabaseConfig } = {};

    private read() {
        this.envConfig = dotenv.parse(fs.readFileSync(this.envScope.length ? `.env.${this.envScope}` : '.env'));
        Logger.verbose(this.envScope, 'Loaded environment');
    }

    private init() {
        this.jwt = {
            secret: this.env('JWT_SECRET', 'JWT-SupER-SECRet.. But-rePlace-it-anywAy.'),
            expiresIn: this.env('JWT_EXPIRES_IN', '3600s'),
        };
        const apiVersion = this.env('API_VERSION', '');
        this.api = {
            port: parseInt(this.env('API_PORT', 3000)),
            host: this.env('API_HOST', '0.0.0.0'),
            version: apiVersion,
            path: this.env('API_PATH', 'api') + (apiVersion.length ? `/${apiVersion}` : ''),
        };
        this.assetsPath = this.env('ASSETS_PATH', __dirname);
        this.cryptoMineAssetsUrl = this.env('CRYPTO_MINE_ASSETS_URL');
        this.avatarAssetsUrl = this.env('AVATARS_ASSETS_URL');
        this.influencerMaterialsDownloadPath = path.join(this.assetsPath, 'data/subscriptions/influencer/materials');
        this.databases = DatabaseConfig.configureFromEnv(this.envConfig);
    }

    constructor(instance?: Config) {
        if (instance) return instance;
        if (process.env.hasOwnProperty('NODE_ENV')) this.envScope = process.env.NODE_ENV!.toLowerCase();
        this.read();
        this.init();
    }

    env(key: string, defaultValue: any = undefined): string {
        return this.envConfig.hasOwnProperty(key) ? this.envConfig[key] : defaultValue;
    }

}

export const config = new Config();
