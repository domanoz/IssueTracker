import { createServer } from './server';
import {Config} from './config/config';

const PORT = 3001;

const main = async () => {    
    const app = await createServer(Config);

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

main().catch((err) => console.log(err));
