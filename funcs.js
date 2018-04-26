const fs = require('fs');
const path = require('path');

/**
 * General purpose data encoding
 *
 * (string): string
 */
function encode (data) {
  return (new Buffer(data)).toString('base64')
}

/**
 * Inverse of `encode`
 *
 * (string): string
 */
function decode (data) {
  return (new Buffer('' + data, 'base64')).toString()
}

/**
 * Encode a superhero name
 *
 * (string): string
*/
function encodeName (name) {
  return encode('@' + name)
}

/**
 * Load the database
 *
 * (string, (?Error, ?Object))
 */
function loadDb (dbFile, cb) {
  fs.readFile(dbFile, function (err, res) {
    if (err) { return cb(err) }

    let messages;
    try {
      messages = JSON.parse(res)
    } catch (e) {
      return cb(err)
    }

    return cb(null, { file: dbFile, messages: messages })
  })
}

/**
 * Find the user's inbox, given their encoded username
 *
 * (Object, string): Object
 */
function findInbox (db, encodedName) {
  const messages = db.messages;
  return {
    dir: path.dirname(db.file),
    messages: Object.keys(messages).reduce(function (acc, key) {
      if (messages[key].to === encodedName) {
        return acc.concat({
          hash: key,
          lastHash: messages[key].last,
          from: messages[key].from
        })
      } else { return acc }
    }, [])
  }
}

/**
 * Find the next message, given the hash of the previous message
 *
 * ({ messages: Array<Object> }, string): string
 */
function findNextMessage (inbox, lastHash) {
  // find the message which comes after lastHash
  let found;
  for (let i = 0; i < inbox.messages.length; i++) {
    if (inbox.messages[i].lastHash === lastHash) {
      outPut('Found lastHash: ' + lastHash);
      found = i;
      break
    }
  }
    // read and decode the message and send to output
  fs.readFile(path.join(inbox.dir, inbox.messages[found].hash), function (req, res) {
      return outPut('from: ' + decode(inbox.messages[found].from) + '\n---\n' + 'message: ' + decode(res.toString()));
  });
}

function outPut(str) {
    console.log(str);
}

module.exports ={ loadDb,encodeName, findInbox, findNextMessage };
