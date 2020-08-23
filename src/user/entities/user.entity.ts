import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne, Index, OneToOne, OneToMany, PrimaryColumn
} from "typeorm";
import { CountryEntity, StateEntity } from "./../../location/location.entities";

@Entity("user")
@Index("ix_username", ["username",])
@Index("ix_pass", ["password"])
@Index("ix_user_email", ["email"])
export class UserEntity {

    @PrimaryColumn({
        type: 'bigint',
        name: 'id',
    })
    id: number;

    @Column("varchar", {
        nullable: false,
        unique: true,
        length: 191,
        name: "username"
    })
    username: string;


    @Column("blob", {
        nullable: false,
        name: "password"
    })
    password: Buffer;


    @Column("varchar", {
        nullable: false,
        length: 191,
        name: "first_name"
    })
    first_name: string;


    @Column("varchar", {
        nullable: false,
        length: 191,
        name: "last_name"
    })
    last_name: string;


    @Column("varchar", {
        length: 191,
        name: "email"
    })
    email: string;


    @Column("varchar", {
        nullable: true,
        length: 30,
        default: "NULL",
        name: "phone"
    })
    phone?: string;


    @Column("bigint", {
        nullable: true,
        default: "0",
        name: "date_of_birth"
    })
    date_of_birth?: number;


    @Column("varchar", {
        nullable: true,
        length: 100,
        default: "''",
        name: "city"
    })
    city?: string;

    @Column("int", {
        nullable: true,
        default: "NULL",
        name: "country_id"
    })
    country_id?: number;


    @Column("int", {
        nullable: true,
        default: "NULL",
        name: "state_id"
    })
    state_id?: number;


    @Column("bigint", {
        nullable: false,
        default: "0",
        name: "created_at"
    })
    created_at: number;

    @OneToOne(type => CountryEntity, cou => cou.user)
    @JoinColumn({ name: 'country_id' })
    country: CountryEntity;

    @OneToOne(type => StateEntity, s => s.user)
    @JoinColumn({ name: 'state_id' })
    state: StateEntity;

    publicName(): string {
        return `${this.first_name} ${this.last_name}`;
    }

    isPasswordEqual(password: string): boolean {
        return this.password ? this.password.toString() === password : false;
    }

    constructor(init?: Partial<UserEntity>) {
        Object.assign(this, init);
    }
}
