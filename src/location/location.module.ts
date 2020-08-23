import { Module } from '@nestjs/common';
import { LocationService } from "./location.service";
import { LocationController } from "./location.controller";
import { DatabaseConfig } from "../config/database.config";
import { DatabaseAliases } from "../config/database.alias";

@Module({
    imports: [
        DatabaseConfig.featureModuleNamed(DatabaseAliases.world),
    ],
    controllers: [
        LocationController,
    ],
    providers: [
        LocationService,
    ],
    exports: [
        LocationService
    ]
})
export class LocationModule {
}
