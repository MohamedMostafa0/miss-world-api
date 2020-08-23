import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { ShortCountryInfo, ShortStateInfo } from "./dto/output.dto";
import { DatabaseAliases } from "../config/database.alias";
import { CountryEntity, StateEntity } from "./location.entities";


@Injectable()
export class LocationService {

    private countryIconsUrl: string = 'http://74.208.68.245/remote/img/flags-by-code-2';

    constructor(
        @InjectRepository(CountryEntity, DatabaseAliases.world)
        private readonly countryRepository: Repository<CountryEntity>,
        @InjectRepository(StateEntity, DatabaseAliases.world)
        private readonly stateRepository: Repository<StateEntity>,
    ) {
    }

    countryIcon(abbr: string): string {
        return `${this.countryIconsUrl}/${abbr.toUpperCase()}.png`;
    }

    countries(enabled: number = 1): Promise<CountryEntity[]> {
        // let opt: FindManyOptions<CountryEntity> = {};
        // if (enabled !== undefined) opt.where = { enabled };
        // return this.countryRepository.find(opt);
        return this.countryRepository.createQueryBuilder()
            .select()
            .where('enabled = :enabled' , {enabled})
            .orderBy('name', 'ASC')
            .getMany();
    }

    country(id: number): Promise<CountryEntity | undefined> {
        return this.countryRepository.findOne(id);
    }

    state(id: number): Promise<StateEntity | undefined> {
        return this.stateRepository.findOne(id);
    }

    states(enabled: number = 1): Promise<StateEntity[]> {
        let opt: FindManyOptions<StateEntity> = { where: { enabled } };
        return this.stateRepository.find(opt);
    }

    statesOf(country: number, enabled: number = 1): Promise<StateEntity[]> {
        // let opt: FindManyOptions<StateEntity> = { where: { country: country, enabled } };
        // return this.stateRepository.find(opt);
        return this.stateRepository.createQueryBuilder()
        .select()
        .where('enabled = :enabled' , {enabled})
        .andWhere('country = :country' , {country})
        .orderBy('name', 'ASC')
        .getMany();
    }

    countryDto(entity: CountryEntity): ShortCountryInfo {
        return {
            id: entity.id,
            name: entity.name,
            code: entity.ISO2,
            flag: this.countryIcon(entity.ISO2)
        };
    }

    stateDto(entity: StateEntity): ShortStateInfo {
        return {
            id: entity.id,
            name: entity.name.toString(),
            code: entity.localCode
        }
    }

    convertIpToNumeric(ipAddress: string) {
        const arrIp = ipAddress.split('.');
        const segment1 = parseInt(arrIp[0]);
        const segment2 = parseInt(arrIp[1]);
        const segment3 = parseInt(arrIp[2]);
        const segment4 = parseInt(arrIp[3]);
        const calc = segment4 + (segment3 * 256) + (segment2 * 65536) + (segment1 * 16777216);
        return calc;
    }

    intToIP(num: number) {
        const part1 = num & 255;
        const part2 = ((num >> 8) & 255);
        const part3 = ((num >> 16) & 255);
        const part4 = ((num >> 24) & 255);
        return part4 + '.' + part3 + '.' + part2 + '.' + part1;
    }
}
