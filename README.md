This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## JEST WORKAROUND

put it on top of the testfile an uncomment to get the right Jest types instead of Mocha typings
import '@types/jest';

## FIREBASE CENTRAL AUTHORITY - RELATIME DATABASE

**IT IS NECESSARY TO RELOAD THE BROWSER WITNODOW ON SIGN OUT FROM THE FIREBASE APP**

**FIREBASE DO NOT ALLOW TO SIGN UP IN ANOTHER APPLICATION IF WAS SIGNED IN ANOTHER BEFORE FOR AN UNKNOWN REASON (may be cause the default application was deleted)**

**FIREBASE DO NOT ALLOW TO USE THE SAME EMAIL, WHEN AUTHORIZED ON A DIFFERENT APPS FOR AN UNKNOWN REASON**

**Must be set rules as**

`{ /* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */ "rules": { ".read": true, ".write": true, "credentials": { ".read": true, ".write": "!data.exists()", ".indexOn": "firebase_user_id" } } }`

instead of "credentials" must be a value of the constant "CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX"

!!It is necessary to set the configuration, to prevent data filtration
on the client:
".indexOn": "firebase_user_id"

version of the firebase rules which allowed userId with guid or user login as user id in the user idenitity string

```
{
  /* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */
  "rules": {
    ".read": "true",
    ".write": "auth != null",
      "credentials": {
        "$userID": {
          ".validate": "!data.exists() && newData.exists() && ($userID.beginsWith('02https:*_S%ë5nN*_S%ë5nNprotocol-f251b_P%ë5nN*firebaseio_P%ë5nN*com') || $userID.beginsWith('01https:*_S%ë5nN*_S%ë5nNprotocol-f251b_P%ë5nN*firebaseio_P%ë5nN*com')) && newData.hasChildren(['credentials', 'firebase_user_id']) && newData.child('credentials').isString() && newData.child('firebase_user_id').isString() && newData.child('credentials').val().length < 5000 && newData.child('credentials').val().length > 100 && newData.child('firebase_user_id').val() === auth.uid",
          ".indexOn": "firebase_user_id",
        }
      }
  }
}
```

another version of the firebase rules which allowed userId only with the auth.uid in the user idenitity string
this version of the rules must be used if the user allowed only a one user identity per account

```
{
  "rules": {
    ".read": "true",
    ".write": "auth != null",
      "credentials": {
        "$userID": {
          ".validate": "!data.exists() && newData.exists() && $userID === '02https:*_S%ë5nN*_S%ë5nNwatcha3-191815_P%ë5nN*firebaseio_P%ë5nN*com|' + auth.uid + '_D%5nNë*' && newData.hasChildren(['credentials', 'firebase_user_id']) && newData.child('credentials').isString() && newData.child('firebase_user_id').isString() && newData.child('credentials').val().length < 5000 && newData.child('credentials').val().length > 100 && newData.child('firebase_user_id').val() === auth.uid",
          ".indexOn": "firebase_user_id"
        }
      }
  }
}
```

### CREDENTIALS STORAGE FORMAT

The key for the credentials storage value is a crypto hash from the user login
The value is salt which is encrypted by the crypto key produced by the login
The crypto credentials are encrypted by the login + password

### RESTRICTIONS FOR ORBIT DB

Any database closed once can't be opened till the instance of the SwarmStorage not be reopened. The workaround for it may be
the following:

- do not close the databse till the user is logged in or not close a broser's tab.
- all closed databases may be muted.
- in the window.onbeforeunload or on the SwarmStorage 'close' event listener, close all the databases,
  which were closed before.

### TODO

# for performance reason it's necessary to implement in-memory (or not encrypted) storage for databases

which are like pubsub channels (for example this kind of storage must be used for geolocation sharing
or collaborative document editing).

# for performance reason it's necessary to improve the performance of the secret storage

to do not encrypt each key - value, but encrypt all data when loading or closing. All
data must be stored in-memory and then replicated to any storage? encrypted. And when a data loaded
from the storage it's necessary to ecrypt it.

# for video-chat hypervision-browser must be used as the library for sharing video data from peer to peer.
