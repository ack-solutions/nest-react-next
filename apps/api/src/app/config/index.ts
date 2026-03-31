import app from './app';
import database from './database';
import mail from './mail';
import nest_auth from './nest_auth';
import storage from './storage';

export const Configs = [
    database,
    app,
    mail,
    nest_auth,
    storage
];
