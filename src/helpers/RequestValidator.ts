import { Request } from 'express';

export abstract class RequestValidator {

    public static paramsAreIntegers(req: Request, params: string[]): boolean {
        return this.areIntegers(req.params, params);
    }

    public static bodyAreIntegers(req: Request, params: string[]): boolean {
        return this.areIntegers(req.body, params);
    }

    public static areIntegers(values: { [id: string]: string }, params: string[]): boolean {
        const isInteger = (value: string) => isNaN(parseInt(value, 10)) === false;
        const notIntegerParam = params.find((param) => isInteger(values[param]) === false);
        return notIntegerParam === undefined;
    }

    public static requiredOnParams(req: Request, params: string[]): boolean {
        return this.required(req.params, params);
    }

    public static requiredOnBody(req: Request, params: string[]): boolean {
        return this.required(req.body, params);
    }

    public static required(list: { [id: string]: string } | undefined, parmlist: string[]): boolean {
        if (!list) {
            return false;
        }
        for (const entry of parmlist) {
            if (list[entry] === undefined) {
                return false;
            }
        }
        return true;
    }

}