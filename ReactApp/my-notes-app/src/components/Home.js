// This is the Home component where notes management and display logic is implemented.
// The component fetches notes from the API and allows searching, creating, editing, and saving notes.
// It also provides functionality for uploading files and displays notes in a user-friendly interface.

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

/**
 * Functional component representing the Home page.
 * Manages state for notes, search term, note content, creation status, loading status, error,
 * editing note ID, and file upload.
 * @returns JSX element displaying the Home page content.
 */

const Home = () => {
  // State variables for managing notes, search term, note content, creating state, loading state, error handling, editing note id, and file to be uploaded
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [file, setFile] = useState(null); // State for the file to be uploaded

  // Effect hook to fetch notes when the component mounts or when creating a new note
  useEffect(() => {
    if (!isCreating) {
      fetchNotes();
    }
  }, [isCreating]);

  // Function to fetch notes from the API
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

  // Function to handle search functionality
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

  // Function to handle changes in note content
  const handleNoteChange = (event) => {
    setNoteContent(event.target.value);
  };

  // Function to handle form submission for creating or updating a note



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
//
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
