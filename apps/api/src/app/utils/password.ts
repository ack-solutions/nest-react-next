import * as bcrypt from 'bcrypt';
export function generatePassword() {
    let pass = '';
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let index = 0; index < 8; index++) {
        const char = Math.floor(Math.random() * str?.length + 1);
        pass += str.charAt(char)
    }
    return pass;
}

export function hashPassword(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}