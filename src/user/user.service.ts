import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions } from 'typeorm';
import { UserProfile } from './dto/output.dto';
import * as crypto from 'crypto';
import { config } from '../config/config';
import { from, Observable, pipe } from 'rxjs';
import { LocationService } from '../location/location.service';
import { DatabaseAliases } from '../config/database.alias';
import { CreateAccountRequest } from './dto/input.dto';
import { List, Map } from 'immutable';
import { throwUserNotFound, throwRegisterError, throwLoginError, throwRegisterErrorEmail, throwRegisterErrorUsername,} from '../shared/http-exception-custom';
import { genearetUniqueId } from '../shared/utils';

@Injectable()
export class UserService {

    private encKey: string = config.databases[DatabaseAliases.world].enck!;

    constructor(
        @InjectRepository(UserEntity, DatabaseAliases.world)
        private readonly repository: Repository<UserEntity>,
        private readonly locationService: LocationService,
    ) {
    }

    async findByCredentials(username: string, password: string) {
        const user = await this.findByUsernameOrEmailToLogin(username);
        if (!user) {
            throwLoginError();
        }
        const pass = crypto.createHash('sha1').update(password).digest('hex');
        const isPassEqual = user.isPasswordEqual(pass);
        if (!isPassEqual) {
            throwLoginError();
        }
        return user;
    }

    async findByUsernameOrEmailToLogin(auth: string): Promise<UserEntity | undefined> {
        return this.repository.createQueryBuilder()
            .select()
            .where('username = :username', { username: auth })
            .orWhere('email = :email', { email: auth })
            .getOne();
    }
    public async create(req: CreateAccountRequest) {
        const isPasswordConfirmed = req.password === req.confirmPassword;
        if (!isPasswordConfirmed) {
            throwRegisterError('Password Not Match');
        }
        let user = await this.findByEmail(req.email);
        if (!!user) {
            throwRegisterErrorEmail('User With This Email Already Exists');
        }
        user = await this.findByUsername(req.username).toPromise();
        if (!!user) {
            throwRegisterErrorUsername('User With This Username Already Exists');
        }
        let id = genearetUniqueId(10);
        let checkId = await this.findById(id).toPromise();
        while (!!checkId) {
            id = genearetUniqueId(10);
            checkId = await this.findById(id).toPromise();
        }
        const userRecord = await this.repository.createQueryBuilder()
            .insert()
            .values([
                {
                    id,
                    username: req.username,
                    email: req.email,
                    password: () => `SHA1('${req.password}')`,
                    first_name: req.firstname,
                    last_name: req.lastname,
                    created_at: Date.now() / 1000,
                    country_id: req.countryId,
                    state_id: req.stateId,
                    city: req.city,
                    phone: req.phone,
                    date_of_birth: req.dateOfBirth,
                },
            ]).execute();

        const userRecordId = Number(userRecord.identifiers[0].id);
        return userRecord;
    }
    async profileDto(idOrUserEntity: number | UserEntity): Promise<UserProfile | undefined> {
        let profile: UserProfile | undefined = undefined;

        const user: UserEntity | undefined = typeof idOrUserEntity == 'number' && idOrUserEntity
            ? await this.repository.findOne({ where: { id: idOrUserEntity } })
            : idOrUserEntity as UserEntity;
        if (user && user.id && user.id > 0) {
            const countryInfo = await this.locationService.country(user.country_id);
            let stateId = 1;
            if (!user.state_id) {
                const states = await this.locationService.statesOf(countryInfo.id);
                if (!!states && states.length > 0) {
                    stateId = states[0].id;
                }
            } else {
                stateId = user.state_id;
            }
            const stateInfo = await this.locationService.state(stateId);
            profile = {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                birthdate: !!user.date_of_birth ? user.date_of_birth : undefined,
                country: countryInfo ? this.locationService.countryDto(countryInfo) : undefined,
                state: stateInfo ? this.locationService.stateDto(stateInfo) : undefined,
                city: user.city,
                phone: user.phone,
            };
        }
        return profile;
    }

    findById(id: number): Observable<UserEntity | undefined> {
        return from(this.repository.findOne(id));
    }

    findBy(where: FindConditions<UserEntity>): Observable<UserEntity | undefined> {
        return from(this.repository
            .createQueryBuilder()
            .select('*')
            .addSelect(`password`, 'password')
            .where(where)
            .getRawOne()
            .then(u => u ? new UserEntity(u) : undefined)
        );
    }

    findByUsername(username: string): Observable<UserEntity | undefined> {
        return this.findBy({ username });
    }

    async oneOrNotFound(id: number): Promise<UserEntity> {
        const user = await this.repository.findOne(id);
        if (!user) throwUserNotFound();
        return user!;
    }

    async oneByUsernameOrNotFound(username: string): Promise<UserEntity> {
        const user = await this.repository.findOne({ username });
        if (!user) throwUserNotFound();
        return user!;
    }

    async findByIds(uids: number[]): Promise<UserEntity[]> {
        return this.repository.createQueryBuilder().whereInIds(uids).getMany();
    }

    async findByUsernameOrEmail(username: string, email: string): Promise<UserEntity | undefined> {
        return await this.repository.createQueryBuilder()
            .select()
            .where('username = :username', { username })
            .orWhere('email = :email', { email })
            .getOne();
    }

    async findByEmail(email: string): Promise<UserEntity | undefined> {
        return await this.repository
            .createQueryBuilder()
            .select()
            .where('email = :email', { email })
            .getOne();
    }

    async mapByIds(uids: number[] | List<number>): Promise<Map<string, UserEntity>> {
        if (List.isList(uids)) uids = uids.toArray();
        return List<UserEntity>(uids.length ? await this.findByIds(uids) : [])
            .reduce((acc, u) => acc.set(u.id.toString(), u), Map<string, UserEntity>());
    }
}
