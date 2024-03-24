import { CognitoUserPool } from 'amazon-cognito-identity-js';

// Define the pool data with UserPoolId and ClientId from environment variables
const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID,
};

// Create a new Cognito User Pool instance using the pool data
const userPool = new CognitoUserPool(poolData);

// Output environment variables for debugging purposes
console.log("Environment Variables:", `UserPoolId: ${process.env.REACT_APP_COGNITO_USER_POOL_ID}`, `ClientId: ${process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID}`);

export default userPool;
