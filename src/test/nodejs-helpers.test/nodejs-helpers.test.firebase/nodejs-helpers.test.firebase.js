const admin = require('firebase-admin');
const serviceKey = require('./firebase.serviceKey.json');

const removeAllUsers = async () => {
  debugger;
  const initResult = await admin.initializeApp({
    credential: admin.credential.cert(serviceKey),
    databaseURL: 'https://protocol-f251b.firebaseio.com',
  });

  if (initResult instanceof Error) {
    console.error(initResult);
    return new Error("Can't initialize the application");
  }

  function deleteUser(uid) {
    admin
      .auth()
      .deleteUser(uid)
      .then(function() {
        console.log('Successfully deleted user', uid);
      })
      .catch(function(error) {
        console.log('Error deleting user:', error);
      });
  }

  function getAllUsers(nextPageToken) {
    admin
      .auth()
      .listUsers(100, nextPageToken)
      .then(function(listUsersResult) {
        listUsersResult.users.forEach(function(userRecord) {
          let uid = userRecord.toJSON().uid;
          deleteUser(uid);
        });
        if (listUsersResult.pageToken) {
          getAllUsers(listUsersResult.pageToken);
        }
      })
      .catch(function(error) {
        console.log('Error listing users:', error);
      });
  }
  getAllUsers();
};

removeAllUsers();
