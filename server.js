import server from './index.js';
import dbConnector from './src/config/db.js';

const port = process.env.PORT || 8081;

server.listen(port, async()=>{
    console.log(`Server start listening at port ${port}.`);
    await dbConnector();
});