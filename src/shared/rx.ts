import { pipe } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import {
    throwInternalError as throwInternalErrorException,
    throwNotFound,
} from "./http-exception-custom";
import { throwBadRequest, throwUnauthorized } from "./http-exception-custom";
import { HttpException, HttpStatus } from "@nestjs/common";

export const throwWhenNotFound = pipe(
    tap((value: any) => value || throwNotFound())
);

export const throwWhenUnauthorized = () => pipe(
    tap((value: any) => value || throwUnauthorized())
);

export const throwWhenInternalError = () => pipe(
    tap((value: any) => value || throwInternalErrorException())
);

export const throwInternalErrorWhenUndefined = (message: string = "Internal API error") => pipe(
    map((value: any) => {
        if (value == undefined) throwInternalErrorException(message);
        return value;
    })
);
