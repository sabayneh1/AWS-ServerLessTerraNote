import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import UserPool from './UserPool';

// Component for user sign-in using Amazon Cognito
const SignIn = ({ onSignIn }) => {
  // State for user inputs and flow control
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); // Required for new password challenge
  const [isNewPasswordRequired, setIsNewPasswordRequired] = useState(false); // Flag for new password challenge
  const [user, setUser] = useState(null); // Holds the current Cognito user object

  // Handles form submission for sign-in
  const onSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Initialize Cognito user object with provided username and user pool
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: UserPool,
    });

    // Authentication details with username and password
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    // Authenticate the user with Cognito
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log('onSuccess:', data); // Log success
        onSignIn(); // Invoke callback on successful sign-in
      },
      onFailure: (err) => {
        console.error('onFailure:', err); // Log failure
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        console.log('newPasswordRequired:', userAttributes); // Log new password challenge
        setIsNewPasswordRequired(true); // Trigger UI for new password input
        setUser(cognitoUser); // Save user object for later use
      },
    });
  };

  // Handles the new password challenge form submission
  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      user.completeNewPasswordChallenge(newPassword, {}, {
        onSuccess: (data) => {
          console.log('Password changed successfully', data); // Log success
          onSignIn(); // Invoke callback on successful password update
        },
        onFailure: (err) => {
          console.error('Failed to change password:', err); // Log failure
        },
      });
    }
  };

  // Render the form
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
