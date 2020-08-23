import {
    Index,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne
} from "typeorm";
import { UserEntity } from "./../user/entities";

@Entity("country")
@Index("ISO2", ["ISO2"])
@Index("mf_exception", ["mf_exception"])
export class CountryEntity {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;


    @Column("char", {
        nullable: false,
        length: 2,
        default: "''",
        name: "ISO2"
    })
    ISO2: string;


    @Column("varchar", {
        nullable: false,
        length: 255,
        default: "''",
        name: "name"
    })
    name: string;


    @Column("tinyint", {
        nullable: false,
        width: 1,
        default: "1",
        name: "enabled"
    })
    enabled: number;


    @Column("varchar", {
        nullable: true,
        length: 10,
        default: "NULL",
        name: "phoneCode"
    })
    phoneCode?: string;


    @Column("smallint", {
        nullable: true,
        default: "NULL",
        name: "numericCode"
    })
    numericCode?: number;


    @Column("int", {
        nullable: false,
        default: "0",
        name: "orderIndex"
    })
    orderIndex: number;


    @Column("tinyint", {
        nullable: false,
        width: 1,
        default: "0",
        name: "mf_exception"
    })
    mf_exception: number;


    @Column("tinyint", {
        nullable: false,
        width: 1,
        default: "1",
        name: "cc_enabled"
    })
    cc_enabled: number;


    @Column("int", {
        nullable: false,
        default: "0",
        name: "ibanlen"
    })
    ibanlen: number;


    @Column("varchar", {
        nullable: true,
        length: 10,
        default: "NULL",
        name: "ibanstart"
    })
    ibanstart?: string;

    @OneToOne(type => UserEntity, user => user.country_id)
    user: UserEntity;

    constructor (init?: Partial<CountryEntity>) {
        Object.assign(this, init);
    }
}

@Entity("state")
@Index("country", ["country"])
@Index("enabled", ["enabled"])
export class StateEntity {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "id"
    })
    id: number;


    @Column("char", {
        nullable: false,
        length: 2,
        default: "''",
        name: "iso3166_1"
    })
    iso3166_1: string;


    @Column("varchar", {
        nullable: false,
        length: 10,
        default: "''",
        name: "iso3166_2"
    })
    iso3166_2: string;


    @Column("smallint", {
        nullable: false,
        default: "0",
        name: "country"
    })
    country: number;


    @Column("varchar", {
        nullable: true,
        length: 10,
        default: "NULL",
        name: "localCode"
    })
    localCode: string | undefined;


    @Column("tinyblob", {
        nullable: false,
        name: "name"
    })
    name: Buffer;


    @Column("varchar", {
        nullable: true,
        length: 10,
        default: "NULL",
        name: "regDivision"
    })
    regDivision: string | undefined;


    @Column("varchar", {
        nullable: true,
        length: 255,
        default: "NULL",
        name: "subDivision"
    })
    subDivision: string | undefined;


    @Column("tinyint", {
        nullable: false,
        width: 1,
        default: "0",
        name: "asterisk"
    })
    asterisk: number;


    @Column("tinyint", {
        nullable: false,
        width: 1,
        default: "1",
        name: "enabled"
    })
    enabled: number;

    @OneToOne(type => UserEntity, user => user.state_id)
    user: UserEntity;

    constructor (init?: Partial<StateEntity>) {
        Object.assign(this, init);
    }
}

export default {
    world: [
        StateEntity,
        CountryEntity
    ]
};