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





// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './components/Home'; // Assuming Home component exists
// import EditNote from './components/EditNote';
// import MyStyledApp from './components/MyStyledApp'; // Assuming MyStyledApp is for global styles or layout
// import UploadFile from './components/UploadFile'; // Import the UploadFile component

// function App() {
//     useEffect(() => {
//         console.log("App component mounted");
//     }, []); // Log only once when the component mounts

//     const handleSave = () => {
//         // Redirect to home after saving a note
//         window.location.href = '/';
//     };

//     return (
//         <Router>
//             <div>
//                 <Routes>
//                     <Route path="/" element={<Home />} />
//                     {/* Adjusted the path to match your previous setup */}
//                     <Route path="/notes/edit/:noteId" element={<EditNote onSave={handleSave} />} />
//                     <Route path="/upload" element={<UploadFile />} />
//                     {/* You can add more routes as needed */}
//                 </Routes>
//                 <MyStyledApp />
//             </div>
//         </Router>
//     );
// }

// export default App;
