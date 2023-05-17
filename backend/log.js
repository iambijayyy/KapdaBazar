import { v4 as uuidv4 } from 'uuid';
import { format } from "date-fns";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const audit = {
    log: (req, res, customMessage) => {
        const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;

        const logMessage = `${uuidv4()}\t${dateTime}\t${req.method}\t${req.headers.origin}\t${req.path}\t${res.statusCode}\t${customMessage}\n`;

        if (!fs.existsSync(path.join(__dirname, 'audit'))) {
            fs.mkdir(path.join(__dirname, 'audit'), (err) => {
                if (err) console.log(err);
            });
        }

        fs.appendFile(path.join(__dirname, 'audit', 'logs.txt'), logMessage, (err) => {
            if (err) console.log(err);
        });
    }
};

export default audit;
