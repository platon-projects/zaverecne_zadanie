import * as Db from './dbclient.js';
async function allEvents(){
    return await Db.query('SELECT * FROM events');
}
export {allEvents}