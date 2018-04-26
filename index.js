const path = require('path');
const { encodeName, loadDb, findInbox, findNextMessage } = require('./funcs');
const session = {
  username: process.argv[2],
  lastMessageHash: process.argv[3]
};

if (!session.username || !session.lastMessageHash) {
  console.log('Usage: node index.js <username> <hash>');
    process.exit(0)
}
// 1. load the database
const dbFile = path.join(__dirname, 'db', 'index.json');
loadDb(dbFile, function (err, db) {

  // 2. encode the name
    const encoded = encodeName(session.username);

  // 3. find the user's inbox
    const inbox = findInbox(db, encoded);

  // 4. find the next message
    const nextMessage = findNextMessage(inbox, session.lastMessageHash);

  // 5. print out the message.
  console.log(nextMessage)
});
