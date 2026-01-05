import app from './app';
import database from './database';
import jwt from './jwt';
import mail from './mail';
import nest_auth from './nest_auth';

export const Configs = [
    database,
    app,
    jwt,
    mail,
    nest_auth
];
