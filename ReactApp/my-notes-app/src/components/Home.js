import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, Container, TextField, Box, Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import faUpload along with faSearch
import { faSearch, faUpload } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import UploadFile from './UploadFile';
library.add(fas);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; 

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [file, setFile] = useState(null); // State for the file to be uploaded

  useEffect(() => {
    if (!isCreating) {
      fetchNotes();
    }
  }, [isCreating]);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/notes`);
      setNotes(response.data);
    } catch (error) {
      setError("An error occurred while fetching notes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchNotes();
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/notes/${searchTerm}`);
      setNotes([response.data]); // Display only the searched note
      setEditingNoteId(searchTerm);
      setNoteContent(response.data.content);
    } catch (error) {
      setError("An error occurred while fetching the note.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteChange = (event) => {
    setNoteContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const noteData = { content: noteContent };
    try {
      if (isCreating) {
        await axios.post(`${API_BASE_URL}/notes`, { noteId: searchTerm, ...noteData });
        alert("Note created successfully!");
      } else if (editingNoteId) {
        await axios.put(`${API_BASE_URL}/notes/${editingNoteId}`, noteData);
        alert("Note updated successfully!");
      }
      setIsCreating(false);
      setNoteContent('');
      setSearchTerm('');
      fetchNotes();
    } catch (error) {
      setError("An error occurred while saving the note.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateNewNote = () => {
    setIsCreating(true);
    setEditingNoteId(null);
    setNoteContent('');
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    try {
      const apiUrl = `${API_BASE_URL}/generate-presigned-url/upload`;
      const presignedUrlResponse = await axios.post(apiUrl, {
        file_name: file.name,
      });

      const { url } = presignedUrlResponse.data;
      await axios.put(url, file, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error during file upload:', error);
      alert('Failed to upload file.');
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Notebook Project</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            label="Note ID"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 1, flexGrow: 1 }}
          />
          <Button onClick={handleSearch} variant="contained" color="primary" startIcon={<FontAwesomeIcon icon={faSearch} />} sx={{ mr: 1 }}>
            Search
          </Button>
          <Button onClick={handleCreateNewNote} variant="outlined" color="primary" sx={{ mr: 1 }}>
            Create New
          </Button>
        </Box>
        {isLoading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            label="Note Content"
            multiline
            rows={4}
            fullWidth
            value={noteContent}
            onChange={handleNoteChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mb: 2 }}>
            {isCreating ? "Create Note" : "Save Note"}
          </Button>
        </Box>
        {!isCreating && (
          <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
            {notes.map((note) => (
              <Box key={note.noteId} sx={{ mb: 2 }}>
                <Typography variant="h6">{note.noteId}</Typography>
                <Typography>{note.content}</Typography>
                <Button onClick={() => { setEditingNoteId(note.noteId); setNoteContent(note.content); setIsCreating(false); }} variant="contained" color="primary" sx={{ mt: 1 }}>
                  Edit
                </Button>
              </Box>
            ))}
          </Paper>
        )}
        {/* Improved UploadFile Component Integration */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
          <UploadFile />
        </Box>
      </Container>
    </div>
  );
};

export default Home;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import EditNote from './EditNote';
// import UploadFile from './UploadFile';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';

// const API_BASE_URL = "https://ula9owg2j8.execute-api.ca-central-1.amazonaws.com/api";

// const Home = () => {
//   const [notes, setNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredNotes, setFilteredNotes] = useState([]); // State for filtered notes
//   const [editingNoteId, setEditingNoteId] = useState(null);
//   const [isCreatingNewNote, setIsCreatingNewNote] = useState(false);
//   const [isLoading, setIsLoading] = useState(false); // For loading state
//   const [error, setError] = useState(null); // For error state

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const fetchNotes = async () => {
//     setIsLoading(true);
//     setError(null); // Reset error on retry
//     try {
//       const response = await axios.get(`${API_BASE_URL}/notes`);
//       setNotes(response.data);
//       setFilteredNotes(response.data); // Initialize filtered notes with all notes
//     } catch (error) {
//       console.error("Fetching notes failed: ", error); // Log the error to the console
//       setError("An error occurred while fetching notes. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchNote = async (noteId) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/notes/${noteId}`);
//       return response.data;
//     } catch (error) {
//       console.error("Fetching the note failed: ", error); // Log the error to the console
//       setError("An error occurred while fetching the note. Please try again.");
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handler for the search button click
//   const handleSearch = () => {
//     const results = notes.filter(note =>
//       note.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredNotes(results);
//   };

//   const handleEditNote = async (noteId) => {
//     const note = await fetchNote(noteId);
//     if (note) {
//       setIsCreatingNewNote(false);
//       setEditingNoteId(noteId);
//     }
//   };

//   const handleCreateNewNote = () => {
//     setIsCreatingNewNote(true);
//     setEditingNoteId(null);
//   };

//   const handleSaveNote = () => {
//     setIsCreatingNewNote(false);
//     setEditingNoteId(null);
//     fetchNotes();
//   };

//   return (
//     <div>
//       <h1>Notebook Project</h1>

//       <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//         <input
//           type="text"
//           placeholder="Search notes..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button onClick={handleSearch} style={{ marginLeft: '5px' }}>
//           <FontAwesomeIcon icon={faSearch} />
//         </button>
//       </div>

//       {isLoading && <p>Loading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {/* Search Results Section */}
//       <div>
//         <h2>Search Results</h2>
//         <ul>
//           {filteredNotes.map(note => (
//             <li key={note.id}>
//               <h3>{note.title}</h3>
//               <p>{note.content}</p>
//               <button onClick={() => handleEditNote(note.id)}>Edit</button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <button onClick={handleCreateNewNote} style={{ marginTop: '10px', display: 'block' }}>
//         Create New Note
//       </button>

//       {isCreatingNewNote && <EditNote mode="create" onSave={handleSaveNote} />}
//       {editingNoteId && !isCreatingNewNote && (
//         <EditNote noteId={editingNoteId} onSave={handleSaveNote} />
//       )}
//       <UploadFile />
//     </div>
//   );
// };

// export default Home;


// the below is with cognito ################################################################################################

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function Home() {
//   const [notes, setNotes] = useState([]); // State for storing notes
//   const [searchTerm, setSearchTerm] = useState(''); // State for storing search term

//   useEffect(() => {
//     // Fetch notes data from an API
//     const fetchNotes = async () => {
//       try {
//         const response = await axios.get('https://x6rhrkzq20.execute-api.ca-central-1.amazonaws.com/api/notes');
//         setNotes(response.data);
//       } catch (error) {
//         console.error('Error fetching notes:', error);
//       }
//     };

//     fetchNotes(); // Call the fetchNotes function

//     console.log("Home component mounted"); // Log a message when the component is mounted
//     // Additional initialization code can be added here

//   }, []); // Run this effect only once on component mount

//   const filteredNotes = notes.filter(note =>
//     note.title.toLowerCase().includes(searchTerm.toLowerCase())
//   ); // Filter notes based on the search term

//   return (
//     <div>
//       <h1>Samander Notebook Project</h1>
//       <p>Instructions on how to use the notebook...</p>

//       <input
//         type="text"
//         placeholder="Search notes..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)} // Update the search term as the user types
//       />

//       <ul>
//         {filteredNotes.map(note => (
//           <li key={note.id}>
//             <h3>{note.title}</h3>
//             <p>{note.content}</p>
//           </li>
//         ))}
//       </ul>

//       <a href="/login">Login</a>
//        ## Provide a link to the login page
//     </div>
//   );
// }

// export default Home; // Export the Home component
