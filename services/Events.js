import * as Db from './dbclient.js';
async function allEvents(){
    return await Db.query('SELECT * FROM events');
}
async function deleteEvent(event_id) {
    // let filePath = 'public/images/post/' + postId + '.jpg';
    // fs.access(filePath, (err) => {
    //     if (!err) {
    //         fs.unlink(filePath, (err) => {
    //             if (err) {
    //                 console.error(`Subor ${filePath} sa nepodarilo vymazat: ${err}`);
    //             }
    //         });
    //     }
    // })

    await Db.query(
        'DELETE FROM events WHERE event_id = :event_id',
        {event_id: event_id}
    );
    console.log(event_id + "deleted succesfully");
}
export {allEvents, deleteEvent}