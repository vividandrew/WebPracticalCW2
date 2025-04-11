import NeDB from '@seald-io/nedb';

// init database tables
const userdb = new NeDB({filename:'./db/user.db', autoload: true});
const classdb = new NeDB({filename:'./db/class.db', autoload: true});
const userClassesdb = new NeDB({filename:'./db/classes.db', autoload: true});

export {userdb, classdb, userClassesdb}