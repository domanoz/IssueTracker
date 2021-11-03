
export enum EServerErrorType {
    NotFound,
    InvalidRequest,
    SomethingWentWrong,
    InternalError
}

export class ServerError {

    private static readonly descriptor: Record<EServerErrorType, { httpCode: number; defaultMessage: string }> = {
        [EServerErrorType.NotFound]: {
            httpCode: 404,
            defaultMessage: 'Requested resource was not found.',
        },
        [EServerErrorType.InvalidRequest]: {
            httpCode: 400,
            defaultMessage: 'Invalid request was made. Check your request params or body.',
        },
        [EServerErrorType.SomethingWentWrong]: {
            httpCode: 400,
            defaultMessage: 'Something went wrong.',
        },
        [EServerErrorType.InternalError]: {
            httpCode: 500,
            defaultMessage: 'Internal server error.',
        }
    };

    private readonly type: EServerErrorType;
    private readonly customMessage: string | null;

    constructor(type: EServerErrorType, customMessage: string | null = null) {
        this.type = type;
        this.customMessage = customMessage;
    }

    public get httpCode(): number {
        return ServerError.descriptor[this.type].httpCode;
    }

    public get message(): string {
        return typeof this.customMessage === 'string'
            ? this.customMessage
            : ServerError.descriptor[this.type].defaultMessage;
    }

}