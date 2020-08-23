import { DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import entities from "./entities";
import { Map } from "immutable";

export class DatabaseConfig {

    static rootModules: DynamicModule[] = [];
    private static registry: {[alias: string]: DatabaseConfig} = {};

    // env section - start
    readonly pass: string;
    readonly user: string;
    readonly name: string;
    readonly host: string;
    readonly port?: number;
    readonly driv: "mysql" | "mariadb";
    readonly enck?: string;
    readonly logg: boolean | "all" | ("error" | "schema" | "query" | "warn" | "info" | "log" | "migration")[] | undefined;
    // env section - end

    private _rootModule: DynamicModule;
    private _featureModule: DynamicModule;

    entities?: any[];

    constructor (public readonly alias: string, init?: Partial<DatabaseConfig>) {
        Object.assign(this, init);
        if (this.driv === undefined) this.driv = "mysql";
        if (this.logg === undefined) this.logg = ["error"];
        this.init();
    }

    static configureFromEnv (envConfig: { [key: string]: any }): { [alias: string]: DatabaseConfig } {
        const dbConfig: { [alias: string]: DatabaseConfig } = {};
        const intKeys = ['port'];
        const boolKeys = ['logg'];
        Map(envConfig)
            .filter((v, k) => k.startsWith('DB__'))
            .reduce((accum, v, k) => {
                let c = (k.substring(4)).split('_');
                const key = c.shift()!.toLowerCase();
                const alias = c.join('_').toLowerCase();
                return accum.setIn([alias, key],
                    intKeys.indexOf(key) > -1 ? parseInt(v)
                        : boolKeys.indexOf(key) > -1 ? ['true', 'yes', 'y', 1].indexOf(v.toLowerCase()) > -1
                        : v
                );
            }, Map<string, Map<string, number | string>>())
            .forEach((v, k) => {
                dbConfig[k] = new DatabaseConfig(k, v.toJS());
            });
        return dbConfig;
    }

    private init () {
        this.entities = entities[this.alias];
        this._rootModule = this.generateRootModule();
        this._featureModule = this.generateFeatureModule();
        DatabaseConfig.rootModules.push(this._rootModule);
        DatabaseConfig.registry[this.alias] = this;
    }

    get rootModule (): DynamicModule {
        return this._rootModule;
    }

    get featureModule (): DynamicModule {
        return this._featureModule;
    }

    static rootModuleNamed (alias: string): DynamicModule {
        return DatabaseConfig.registry[alias]._rootModule;
    }

    static featureModuleNamed (alias: string): DynamicModule {
        return DatabaseConfig.registry[alias]._featureModule;
    }

    generateFeatureModule (entitiesList?: any[]): DynamicModule {
        return TypeOrmModule.forFeature(entitiesList !== undefined ? entitiesList : this.entities, this.alias);
    }

    generateRootModule (entitiesList?: any[]): DynamicModule {
        return TypeOrmModule.forRootAsync({
            name: this.alias,
            useFactory: () => ({
                type: this.driv,
                host: this.host,
                port: this.port,
                username: this.user,
                password: this.pass,
                database: this.name,
                entities: entitiesList !== undefined ? entitiesList : this.entities,
                synchronize: false,
                logging: this.logg,
                cache: false,
            })
        });
    }

}