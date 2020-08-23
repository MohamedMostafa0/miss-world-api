import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { from }                               from "rxjs";
import { throwWhenNotFound }                  from "../shared/rx";
import { map, switchMap, tap }                from "rxjs/operators";
import { LocationService }                    from "./location.service";
import { CountryEntity, StateEntity }         from "./location.entities";
import {
    ApiResponse,
    ApiOperation,
    ApiTags
}                                             from '@nestjs/swagger';
import { ShortCountryInfo, ShortStateInfo }   from "./dto/output.dto";
import { StatesListRequest }                  from "./dto/input.dto";


@ApiTags('location')
@Controller('location')
export class LocationController {

    constructor (private readonly locationService: LocationService) {
    }

    @ApiOperation({ description: "Get countries list" })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of available countries', type: [ShortCountryInfo] })
    @Get('countries')
    countries () {
        return from(this.locationService.countries()).pipe(
            // tap(a => console.log(a)),
            map((c: CountryEntity[]) => c && c.length
                ? c.map(country => this.locationService.countryDto(country))
                : []
            ));
    }

    @ApiOperation({ description: "Get states list by country" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of available states under the country',
        type: [ShortStateInfo]
    })
    @Get('countries/:id/states')
    states (@Param() params: StatesListRequest) {
        return from(this.locationService.country(params.id)).pipe(
            throwWhenNotFound,
            switchMap((c: CountryEntity) => from(this.locationService.statesOf(c.id))),
            map((c: StateEntity[]) => c && c.length
                ? c.map(state => this.locationService.stateDto(state))
                : []
            ));
    }

}
