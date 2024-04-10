import * as Security from '../service/Security.js';
import dotenv from 'dotenv';

dotenv.config();
const args = process.argv.slice(2);

if (args.length !== 2) {
    console.log('Pouzitie: set_password meno_pouzivatela heslo.')
    process.exit(-1);
} else {
    let [username, password] = args;

    Security.setUserPassword(username, password).then((r) => {
        console.log('Heslo bolo nastavene.');
        process.exit(0);
    });
}