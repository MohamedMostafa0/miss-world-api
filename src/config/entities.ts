import { Map, List } from 'immutable';

import UserEntities from '../user/entities';
import LocationEntities from '../location/location.entities';

const entitiesAutoRegistrationList = [
    UserEntities,
    LocationEntities
];


const mapped: { [databaseAlias: string]: any[] } = List(entitiesAutoRegistrationList)
    .reduce((accum, obj: { [alias: string]: any }) => {
        Map(obj).forEach((v: any, k: any) => {
            accum = accum.set(k, accum.get(k, List()).merge(v));
        });
        return accum;
    }, Map<string, List<any>>())
    .map((v, k) => v.toArray())
    .toJSON();

export default mapped;
