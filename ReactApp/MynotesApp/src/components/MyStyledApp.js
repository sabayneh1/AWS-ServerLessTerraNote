import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, TextField, Box, Paper, CssBaseline } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';

function MyStyledApp({ children }) {
  return (
    <div>
      <CssBaseline /> {/* Adds Material UI's basic CSS reset */}

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Notes App
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}> {/* Adjusted spacing */}
        {children}

        {/* Guide on How to Use the Notebook */}
        <Paper elevation={3} sx={{ p: 2, mb: 4, backgroundColor: '#f0f0f0' }}>
          <Typography variant="h5" gutterBottom style={{ color: '#333' }}>
            How to Use the Notebook
          </Typography>
          <Typography variant="body1" gutterBottom>
            1. Create a New Note:
            - Enter the note name you want.
            - Click on "Create New" to create the note.
          </Typography>
          <Typography variant="body1" gutterBottom>
            2. Write Note Content:
            - Write the content of your note.
            - Click on "Save Note" to save the note.
          </Typography>
          <Typography variant="body1" gutterBottom>
            3. Edit Existing Note:
            - Use the search bar to find the note by typing the note name.
            - Click on "Edit" to modify the existing note.
          </Typography>
          <Typography variant="body1">
            4. Upload Files:
            - Choose a file from the bottom section.
            - Click on "Upload" to upload your file.
          </Typography>
        </Paper>
      </Container>

      <footer style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', padding: '15px' }}>
        <Typography variant="body2">
          Created by Samander Abayneh. Contact support at <a href="mailto:samgtest0429@gmail.com">samgtest0429@gmail.com</a>
        </Typography>
      </footer>
    </div>
  );
}

export default MyStyledApp;
