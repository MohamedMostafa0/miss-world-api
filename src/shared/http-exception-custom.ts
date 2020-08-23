import {
    BadRequestException,
    HttpException, HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
// import { createHttpExceptionBody } from '@nestjs/common/utils/http-exception-body.util';

// import { createHttpExceptionBody } from '../utils/http-exception-body.util';

/*
400 Bad Request
401 Unauthorized
402 Payment Required
403 Forbidden
404 Not Found
405 Method Not Allowed
406 Not Acceptable
407 Proxy Authentication Required
408 Request Timeout
409 Conflict
410 Gone
411 Length Required
412 Precondition Failed
413 Payload Too Large
414 Request-URI Too Long
415 Unsupported Media Type
416 Requested Range Not Satisfiable
417 Expectation Failed
418 I'm a teapot
421 Misdirected Request
422 Unprocessable Entity
423 Locked
424 Failed Dependency
426 Upgrade Required
428 Precondition Required
429 Too Many Requests
431 Request Header Fields Too Large
444 Connection Closed Without Response
451 Unavailable For Legal Reasons
499 Client Closed Request
*/

export enum HttpErrors {
    USER_NOT_FOUND = 460,
    INVLID_COUPON = 472,
    NAMECHEAP_ERROR = 473,
    LOGIN_ERROR = 600,
    USER_NOT_CONFIRMED = 601,
    REGISTER_ERROR_USERNAME = 602,
    CONFIRM_EMAIL_ERROR = 603,
    RESEND_EMAIL_ERROR = 604,
    EMAIL_ALREADY_CONFIRMED = 605,
    UPDATE_PROFILE_ERROR = 606,
    RESET_PASSWORD_ERROR = 607,
    CHANGE_PASSWORD_INCORRECT_ERROR = 608,
    REGISTER_ERROR_EMAIL = 609,
    REGISTER_ERROR = 610,
    LOGIN_2FA_NOT_FOUND_Error = 611,
    LOGIN_2FA_SESSION_EXPIRED_Error = 612,
    RESEND_2FA_Error = 613,
    CHANGE_PASSWORD_REPEAT_ERROR = 614,
    CHANGE_PASSWORD_ERROR = 615,
    SET_USER_MAIL_SERVICE_ERROR = 616,
    SET_USER_MAIL_SERVICE_REPEAT_ERROR = 617,
    USER_MAIL_SERVICE_INVALID_API_KEY_ERROR = 618,
    PORTAL_MAIL_IS_FREE_ERROR = 619,
    PORTAL_MAIL_IS_NOT_ACTIVE_ERROR = 620,
    PORTAL_MAIL_PORTAL_NOT_FOUND_ERROR = 621,
    PORTAL_MAIL_MAIL_SERVICE_NOT_FOUND_ERROR = 622,
    PORTAL_MAIL_USER_MAIL_SERVICE_NOT_FOUND_ERROR = 623,
    PORTAL_MAIL_USER_MAIL_SERVICE_NAMECHEAP_NOT_FOUND_ERROR = 624
}

export class CustomHttpException extends HttpException {
    constructor(status: number, error: string, message?: string | object | any) {
        super(HttpException.createBody(message, error, status), status);
    }
}

export const throwNotFound = (message?: string) => {
    throw new NotFoundException(message);
};

export const throwInternalError = (message?: string) => {
    throw new InternalServerErrorException(message);
};

export const throwUnauthorized = (message?: string) => {
    throw new UnauthorizedException(message);
};

export const throwBadRequest = (message?: string) => {
    throw new BadRequestException(message);
};

export const throwUserNotFound = (message?: string) => {
    throw new CustomHttpException(HttpErrors.USER_NOT_FOUND, 'User not found', message);
};

export const throwInvalidCoupon = (message?: string) => {
    throw new CustomHttpException(HttpErrors.INVLID_COUPON, 'Invalid Coupon', message);
};

export const throwNamecheapError = <T>(result?: T) => {
    throw new CustomHttpException(HttpErrors.NAMECHEAP_ERROR, 'Namecheap APi Error', result);
};

export const throwLoginError = () => {
    throw new CustomHttpException(HttpErrors.LOGIN_ERROR, 'Login Failed', 'Wrong username or password');
};

export const throwLoginConfirmError = () => {
    throw new CustomHttpException(HttpErrors.USER_NOT_CONFIRMED, 'Login Failed', 'User not confirmed');
};

export const throwRegisterErrorUsername = (message: string) => {
    throw new CustomHttpException(HttpErrors.REGISTER_ERROR_USERNAME, 'Register Failed', message);
};

export const throwRegisterErrorEmail = (message: string) => {
    throw new CustomHttpException(HttpErrors.REGISTER_ERROR_EMAIL, 'Register Failed', message);
};

export const throwRegisterError = (message: string) => {
    throw new CustomHttpException(HttpErrors.REGISTER_ERROR, 'Register Failed', message);
};

export const throwConfirmEmailError = (message: string) => {
    throw new CustomHttpException(HttpErrors.CONFIRM_EMAIL_ERROR, 'Confirm Email Failed', message);
};

export const throwEmailAlreadyConfirmedError = () => {
    throw new CustomHttpException(HttpErrors.EMAIL_ALREADY_CONFIRMED, 'Email Already Confirmed');
};

export const throwUpdateProfileError = (message: string) => {
    throw new CustomHttpException(HttpErrors.UPDATE_PROFILE_ERROR, 'Update profile Failed', message);
};

export const throwResendEmailError = (message: string) => {
    throw new CustomHttpException(HttpErrors.RESEND_EMAIL_ERROR, 'Resend Email Failed', message);
};

export const throwResetPasswordError = (message: string) => {
    throw new CustomHttpException(HttpErrors.RESET_PASSWORD_ERROR, 'Reset Password Failed', message);
};

export const throwChangePasswordIncorrectError = () => {
    throw new CustomHttpException(HttpErrors.CHANGE_PASSWORD_INCORRECT_ERROR, 'Change Password Failed', 'Incorrect Password');
};

export const throwLogin2FANotFoundError = () => {
    throw new CustomHttpException(HttpErrors.LOGIN_2FA_NOT_FOUND_Error, 'Login Session Error', 'Session not found');
};

export const throwLogin2FAExpiredError = () => {
    throw new CustomHttpException(HttpErrors.LOGIN_2FA_SESSION_EXPIRED_Error, 'Login Session Error', 'Session expired');
};

export const throwResend2FAError = (message: string) => {
    throw new CustomHttpException(HttpErrors.RESEND_2FA_Error, 'Resend 2FA Failed', message);
};

export const throwChangePasswordRepeatError = () => {
    throw new CustomHttpException(HttpErrors.CHANGE_PASSWORD_REPEAT_ERROR, 'Change Password Failed', 'Cannot change the same password');
};

export const throwChangePasswordError = (message: string) => {
    throw new CustomHttpException(HttpErrors.CHANGE_PASSWORD_ERROR, 'Change Password Failed', message);
};

export const throwSetUserMailServiceError = () => {
    throw new CustomHttpException(HttpErrors.SET_USER_MAIL_SERVICE_ERROR, 'Set User Mail Service Failed', 'Mail Service Not Found');
};

export const throwSetUserMailServiceReqpeatError = () => {
    throw new CustomHttpException(HttpErrors.SET_USER_MAIL_SERVICE_REPEAT_ERROR, 'Set User Mail Service Failed', 'User Already Use This Mail Service');
};

export const throwUserMailServiceInvalidApiKeyError = () => {
    throw new CustomHttpException(HttpErrors.USER_MAIL_SERVICE_INVALID_API_KEY_ERROR, 'Mail Service Failed', 'Invalid API Key');
};

export const throwPortalMailIsFreeError = () => {
    throw new CustomHttpException(HttpErrors.PORTAL_MAIL_IS_FREE_ERROR, 'Portal Mail Service Failed', 'Portal Is Free');
};

export const throwPortalMailIsNotActiveError = () => {
    throw new CustomHttpException(HttpErrors.PORTAL_MAIL_IS_NOT_ACTIVE_ERROR, 'Portal Mail Service Failed', 'Portal Is Not Active');
};

export const throwPortalMailPortalNotFoundError = () => {
    throw new CustomHttpException(HttpErrors.PORTAL_MAIL_PORTAL_NOT_FOUND_ERROR, 'Portal Mail Service Failed', 'Portal Not Found');
};

export const throwPortalMailServiceNotFoundError = () => {
    throw new CustomHttpException(HttpErrors.PORTAL_MAIL_MAIL_SERVICE_NOT_FOUND_ERROR, 'Portal Mail Service Failed', 'Mail Service Not Found');
};

export const throwPortalUserMailServiceNotFoundError = () => {
    throw new CustomHttpException(HttpErrors.PORTAL_MAIL_USER_MAIL_SERVICE_NOT_FOUND_ERROR, 'Portal Mail Service Failed', 'User Mail Service Not Found');
};

export const throwPortalUserMailServiceNamecheapNotFoundError = () => {
    throw new CustomHttpException(HttpErrors.PORTAL_MAIL_USER_MAIL_SERVICE_NAMECHEAP_NOT_FOUND_ERROR, 'Portal Mail Service Failed', 'Namecheap Domain Not Found');
};
