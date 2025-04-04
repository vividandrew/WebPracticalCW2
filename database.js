import NeDB from 'nedb';

// init database tables
const userdb = new NeDB({filename:'./db/user.db', autoload: true});
const classdb = new NeDB({filename:'./db/class.db', autoload: true});
const classesdb = new NeDB({filename:'./db/classes.db', autoload: true});
const sessiondb = new NeDB({filename:'./db/session.db', autoload: true});

export {userdb, classdb, classesdb, sessiondb}