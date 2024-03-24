import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import UserPool from './UserPool';

const SignIn = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isNewPasswordRequired, setIsNewPasswordRequired] = useState(false);
  // Declare user as a state variable
  const [user, setUser] = useState(null);

  const onSubmit = (event) => {
    event.preventDefault();

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log('onSuccess:', data);
        onSignIn();
      },
      onFailure: (err) => {
        console.error('onFailure:', err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        console.log('newPasswordRequired:', userAttributes);
        setIsNewPasswordRequired(true);
        setUser(cognitoUser); // Save the user instance to state
      },
    });
  };

  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault();
    // Since `user` is now stored in state, it's accessible here
    if (user) {
      user.completeNewPasswordChallenge(newPassword, {}, {
        onSuccess: (data) => {
          console.log('Password changed successfully', data);
          onSignIn();
        },
        onFailure: (err) => {
          console.error('Failed to change password:', err);
        },
      });
    }
  };

  return (
    <div>
      <form onSubmit={isNewPasswordRequired ? handleNewPasswordSubmit : onSubmit}>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          type="password"
        />
        {isNewPasswordRequired && (
          <input
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New Password"
            type="password"
          />
        )}
        <button type="submit">{isNewPasswordRequired ? "Set New Password" : "Sign In"}</button>
      </form>
    </div>
  );
};

export default SignIn;



// import React, { useState } from 'react';
// import { CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   // const userPool = new CognitoUserPool({
//   //   UserPoolId: process.env.REACT_APP_USER_POOL_ID,
//   //   ClientId: process.env.REACT_APP_APP_CLIENT_ID
//   // });

//   const userPool = new CognitoUserPool({
//     UserPoolId: 'ca-central-1_WTr0Kot6y',
//     ClientId: 's2m96h3qodiqmcapj5u4rgv88'
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const authenticationData = {
//       Username: username,
//       Password: password
//     };

//     const authenticationDetails = new AuthenticationDetails(authenticationData);
//     const userData = {
//       Username: username,
//       Pool: userPool
//     };

//     const cognitoUser = new CognitoUser(userData);

//     cognitoUser.authenticateUser(authenticationDetails, {
//       onSuccess: (result) => {
//         console.log('Authentication successful');
//         const idToken = result.getIdToken().getJwtToken();
//         // Use this ID token in the Authorization header for your API requests

//         // Add your logic here to handle the ID token, e.g., store it in local storage or state
//       },
//       onFailure: (err) => {
//         console.error('Authentication failed', err);
//         // Handle authentication failure
//       }
//     });
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
