import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID, 
  ClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID, 
};

// Create the user pool instance with the pool data
const userPool = new CognitoUserPool(poolData);

// Optional: Console log for debugging purposes.
console.log("Environment Variables:", `UserPoolId: ${process.env.REACT_APP_COGNITO_USER_POOL_ID}`, `ClientId: ${process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID}`);

export default userPool;



