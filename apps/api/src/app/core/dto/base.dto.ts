export class BaseDTO {

    constructor(input?: any) {
        if (input) {
            Object.assign(this, input);
        }
    }

}
