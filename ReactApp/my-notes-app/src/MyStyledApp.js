// import React, { useState, useEffect } from 'react';
// import { AppBar, Toolbar, Typography, Container, TextField, Box, Paper } from '@mui/material';
// import Button from '@mui/material/Button'; // Add this line to import Button
// import axios from 'axios';


// function MyStyledApp({ children }) { // Adding children to render nested components
//   return (
//     <div>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             My Notes App
//           </Typography>
//           {/* Assuming Login button might be used for future auth features */}
//           <Button color="inherit">Login</Button>
//         </Toolbar>
//       </AppBar>
//       <Container maxWidth="md" sx={{ mt: 4 }}>
//         {children} {/* Render children passed to MyStyledApp */}
//       </Container>
//     </div>
//   );
// }

// export default MyStyledApp;
























import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, TextField, Box, Paper } from '@mui/material';
import axios from 'axios';

function MyStyledApp({ editingNoteId }) {
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    if (editingNoteId) {
      fetchNoteContent(editingNoteId);
    }
  }, [editingNoteId]);

  const fetchNoteContent = async (noteId) => {
    try {
      const response = await axios.get(`https://ula9owg2j8.execute-api.ca-central-1.amazonaws.com/api/notes/${noteId}`);
      setNoteContent(response.data.content);
    } catch (error) {
      console.error('Failed to fetch note:', error);
    }
  };

  const handleNoteChange = (event) => {
    setNoteContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`https://mg08bnysdl.execute-api.ca-central-1.amazonaws.com/api/notes/${editingNoteId}`, {
        content: noteContent,
      });
      console.log('Note updated successfully:', response.data);
      alert('Note updated successfully!');
      setNoteContent('');
    } catch (error) {
      console.error('Failed to update note:', error);
      alert('Failed to update note.');
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Notes App
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Your Note
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            multiline
            rows={4}
            fullWidth
            label="Edit Note"
            variant="outlined"
            value={noteContent}
            onChange={handleNoteChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Save Note
          </Button>
        </Box>
        <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
          <Typography variant="body1">
            This is a brief guide on how to use the notebook...
          </Typography>
        </Paper>
      </Container>
    </div>
  );
}

export default MyStyledApp;
