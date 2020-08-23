import { Request } from "express";
import RequestIpParser from "request-ip";
import { Guid } from "guid-typescript";

const stripeFees = {
    USD: { Percent: 2.9, Fixed: 0.30 },
    GBP: { Percent: 2.4, Fixed: 0.20 },
    EUR: { Percent: 2.4, Fixed: 0.24 },
    CAD: { Percent: 2.9, Fixed: 0.30 },
    AUD: { Percent: 2.9, Fixed: 0.30 },
    NOK: { Percent: 2.9, Fixed: 2 },
    DKK: { Percent: 2.9, Fixed: 1.8 },
    SEK: { Percent: 2.9, Fixed: 1.8 },
    JPY: { Percent: 3.6, Fixed: 0 },
    MXN: { Percent: 3.6, Fixed: 3 }
};

export const calculateStripeFees = (amountInUsd: number) => {
    var _fee = stripeFees['USD'];
    var total = (amountInUsd + _fee.Fixed) / (1 - _fee.Percent / 100);
    var fee = total - amountInUsd;
    return fee;
}


export const timeConverterToDate = (UNIX_timestamp: number) => {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours()
    const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    const sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
};

export const timeConverterToDateString = (UNIX_timestamp: number) => {
    const a = new Date(UNIX_timestamp * 1000);
    const year = a.getFullYear();
    const month = a.getMonth();
    const monthConverter = month < 10 ? '0' + month : month;
    const date = a.getDate();
    return year + '-' + monthConverter + '-' + date;
};


export const dateToTimestampNameCheap = (date: string, dayeFirst: boolean) => {
    const arr = date.split('/');
    const newDate = dayeFirst ? arr[1] + "," + arr[0] + "," + arr[2] : arr[0] + "," + arr[1] + "," + arr[2];
    return new Date(newDate).getTime() / 1000;
};

export const amountToDb = (value: number): number => Math.round(1e7 * value);
export const amountFromDb = (value: number): number => value / 1e7;
export const int2ip = (ipInt: number): string => ((ipInt >>> 24) + '.' + (ipInt >> 16 & 255) + '.' + (ipInt >> 8 & 255) + '.' + (ipInt & 255));
export const ip2int = (ip: string): number => ip.split('.').reduce((ipInt, octet) => (ipInt << 8) + parseInt(octet, 10), 0) >>> 0;
export const addMonthToDate = (value: number): number => value + (60 * 60 * 24 * 30);
export const addMonth = (): number => 60 * 60 * 24 * 30;

export function generateString(): string {
    let outString: string = '';
    const inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
    }
    return outString;
}
export function requestIP(req: Request) {
    return RequestIpParser.getClientIp(req);
}

export function GenerateGuid() {
    return Guid.create().toString();
}

const _getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function genearetUniqueId(length: number) {
    var ts = Math.floor((new Date().getTime() / 1000)).toString();
    var parts = ts.split("").reverse();
    var id = "";

    for (var i = 0; i < length; ++i) {
        var index = _getRandomInt(0, parts.length - 1);
        while (parts[index] == '0' && i == 0) {
            index = _getRandomInt(0, parts.length - 1);
        }
        id += parts[index];
    }
    return Number(id);
}
