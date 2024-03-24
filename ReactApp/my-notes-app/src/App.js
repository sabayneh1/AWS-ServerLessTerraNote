// This is the main App component where the routing and authentication logic is handled.
// The component first checks if the user is authenticated, showing the SignIn component if not.
// Once authenticated, the MyStyledApp component is used for global styling.
// Routes are defined for different paths like '/', '/notes/edit/:noteId', and '/upload'.
// Additional routes can be added as needed for the application.

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EditNote from './components/EditNote';
import MyStyledApp from './components/MyStyledApp';
import UploadFile from './components/UploadFile';
import SignIn from './components/SignIn'; // Make sure to create this component as described

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("App component mounted");
    // Optionally check for existing authentication session here
  }, []);

  const handleSave = () => {
    window.location.href = '/';
  };

  const onSignIn = () => {
    setIsAuthenticated(true); // Update state to indicate user is authenticated
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <SignIn onSignIn={onSignIn} />
      ) : (
        <MyStyledApp> {/* Wrap MyStyledApp around Routes for global styling */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes/edit/:noteId" element={<EditNote onSave={handleSave} />} />
            <Route path="/upload" element={<UploadFile />} />
            {/* Additional routes as needed */}
          </Routes>
        </MyStyledApp>
      )}
    </Router>
  );
}

export default App;
