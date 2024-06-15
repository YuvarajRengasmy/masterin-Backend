import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export const ENVIRONMENT = process.env.NODE_ENV;

switch (ENVIRONMENT) {
    case 'production': {
        if (fs.existsSync(path.join(process.cwd(), '/.env.production'))) {
            dotenv.config({ path: ".env.production" });
        } else {
            process.exit(1);
        }
        break;
    }
    case 'development': {
        if (fs.existsSync(path.join(process.cwd(), '/.env.development'))) {
            dotenv.config({ path: ".env.development" });
        } else {
            process.exit(1);
        }
        break;
    }
    case 'testing': {
        if (fs.existsSync(path.join(process.cwd(), '/.env.testing'))) {
            dotenv.config({ path: ".env.testing" });
        } else {
            process.exit(1);
        }
        break;
    }
    default: {
        if (fs.existsSync(path.join(process.cwd(), '/.env.development'))) {
            dotenv.config({ path: ".env.development" });
        } else {
            process.exit(1);
        }

    }
}

export const SERVER = {
    APP_NAME: 'Masterin',
    PORT: process.env['PORT'],
    MONGODB_URL: process.env['MONGODB_URL'] || '',
    CREDENTIALS: process.env['MONGODB_URL'] || '',
    MONGODB_USER: process.env['MONGODB_USER'],
    MONGODB_PASSWORD: process.env['MONGODB_PASSWORD'],
    BASE_URL: process.env['BaseURL'],
    TOKEN_EXPIRATION_IN_MINUTES: 259200000,
    COUNTRY_CODE: '+91',
    SALT: '',
    MAX_DISTANCE_RADIUS_TO_SEARCH: '1',
    THUMB_WIDTH: 300,
    THUMB_HEIGHT: 300,
    BASIC_AUTH_USER: process.env['basicAuthUser'],
    BASIC_AUTH_PWD: process.env['basicAuthKey'],
    CRYPTO_ALGO: 'aes-128-ctr',
    CRYPTO_KEY: 'test',
};
