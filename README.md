This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## FIREBASE CENTRAL AUTHORITY - RELATIME DATABASE

**Must be set rules as**

`{ /* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */ "rules": { ".read": true, ".write": true, "credentials": { ".read": true, ".write": "!data.exists()", ".indexOn": "firebase_user_id" } } }`

instead of "credentials" must be a value of the constant "CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX"

!!It is necessary to set the configuration, to prevent data filtration
on the client:
".indexOn": "firebase_user_id"

```
{
  /* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */
  "rules": {
    ".read": "true",
    ".write": "auth != null",
      "credentials": {
        ".read": true,
        /* prevents delete and wrote an existing value */
    		".write": "!data.exists() && newData.exists()",
        ".indexOn": "firebase_user_id",
        "$userID": {
          ".write": "!data.exists() && newData.exists()",
          ".validate": "!data.exists() && ($userID.beginsWith('02https%3A*_S%25%C3%AB5nN*_S%25%C3%AB5nNprotocol-f251b_P%25%C3%AB5nN*firebaseio_P%25%C3%AB5nN*com%7C') || $userID.beginsWith('01https%3A*_S%25%C3%AB5nN*_S%25%C3%AB5nNprotocol-f251b_P%25%C3%AB5nN*firebaseio_P%25%C3%AB5nN*com%7C')) && newData.hasChildren(['credentials', 'firebase_user_id']) && newData.child('credentials').isString() && newData.child('firebase_user_id').isString() && newData.child('credentials').val().length < 5000 && newData.child('credentials').val().length > 100 && newData.child('firebase_user_id').val() === auth.uid",
          ".indexOn": "firebase_user_id",
          "firebase_user_id": {
            ".read": "data.val() === auth.uid"
          }
        }
      }
  }
}
```
