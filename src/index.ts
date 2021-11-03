import { createServer } from './server';
import {Config} from './config/config';

const main = async () => {    
    const app = await createServer(Config);

    app.listen(Config.serverPort, () => console.log(`Server started on port ${Config.serverPort}`));
}

main().catch((err) => console.log(err));
