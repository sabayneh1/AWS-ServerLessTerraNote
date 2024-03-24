import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; 

const EditNote = ({ onSave }) => {
  const [noteContent, setNoteContent] = useState('');
  const { noteId } = useParams(); // This will be undefined for new notes
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNoteContent = async () => {
      if (noteId) { // Only fetch content if editing an existing note
        try {
          const response = await axios.get(`${API_BASE_URL}/notes/${noteId}`);
          setNoteContent(response.data.content);
        } catch (error) {
          console.error('Failed to fetch note:', error);
        }
      }
    };
    fetchNoteContent();
  }, [noteId]);

  const handleNoteChange = (event) => {
    setNoteContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (noteId) {
        // Update existing note
        await axios.put(`${API_BASE_URL}/notes/${noteId}`, { content: noteContent });
        console.log('Note updated successfully');
      } else {
        // Create new note
        const response = await axios.post(`${API_BASE_URL}/notes`, { content: noteContent });
        const newNoteId = response.data.noteId; // Assuming your API responds with the created note's ID
        console.log('Note created successfully, ID:', newNoteId);
        navigate(`/notes/edit/${newNoteId}`); // Redirect to edit the new note
      }
      onSave(); // Trigger any post-save actions
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={noteContent}
        onChange={handleNoteChange}
        placeholder="Enter your note content here..."
        rows="10"
        cols="50"
      ></textarea>
      <br />
      <button type="submit">{noteId ? 'Save Changes' : 'Create Note'}</button>
    </form>
  );
};

export default EditNote;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import { useParams } from 'react-router-dom'; // Import useParams hook


// // Manually inserting the API base URL
// const API_BASE_URL = "https://9ruk2kjb04.execute-api.ca-central-1.amazonaws.com/api";

// const EditNote = ({ noteId, onSave }) => {
//   const [noteContent, setNoteContent] = useState('');

//   useEffect(() => {
//     const fetchNote = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/notes/${noteId}`);
//         setNoteContent(response.data.content);
//       } catch (error) {
//         console.error('Failed to fetch note:', error);
//         alert('An error occurred while fetching the note.');
//       }
//     };

//     if (noteId) {
//       fetchNote();
//     }
//   }, [noteId]);

//   const handleNoteChange = (event) => {
//     setNoteContent(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       if (noteId) {
//         await axios.put(`${API_BASE_URL}/notes/${noteId}`, { content: noteContent });
//       } else {
//         await axios.post(`${API_BASE_URL}/notes`, { noteId: uuidv4(), content: noteContent });
//       }
//       console.log('Note saved successfully');
//       onSave();
//     } catch (error) {
//       console.error('Failed to save note:', error);
//       alert('An error occurred while saving the note.');
//     }
//   };

//   return (
//     <div>
//       <h2>{noteId ? 'Edit Note' : 'Create Note'}</h2>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={noteContent}
//           onChange={handleNoteChange}
//           placeholder="Edit your note here..."
//           rows={5}
//           cols={50}
//         ></textarea>
//         <br />
//         <button type="submit">{noteId ? 'Save Changes' : 'Create Note'}</button>
//       </form>
//     </div>
//   );
// };

// export default EditNote;





// the below is with the congitoo  ####################################################################################################

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function EditNote({ noteId, initialContent, onSave }) {
//   const [noteContent, setNoteContent] = useState(initialContent); // Initialized with the current note content

//   const handleNoteChange = (event) => {
//     setNoteContent(event.target.value); // Update the note content as the user types
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       // Assuming your API expects a PUT request to update the note
//       // Replace `YOUR_API_ENDPOINT` with your actual endpoint URL
//       // and ensure it's configured to accept PUT requests for updating notes
//       const response = await axios.put(`'https://x6rhrkzq20.execute-api.ca-central-1.amazonaws.com/api/notes${noteId}`, {
//         content: noteContent,
//       });

//       console.log('Note updated successfully:', response.data);
//       onSave(); // Callback function to trigger after saving changes (e.g., to refresh the list of notes)
//     } catch (error) {
//       console.error('Failed to update note:', error);
//       alert('An error occurred while saving the note.');
//     }
//   };

//   useEffect(() => {
//     console.log("EditNote component mounted");
//     // Additional initialization code can be added here

//   }, []); // Run this effect only once on component mount

//   return (
//     <div>
//       <h2>Edit Note</h2>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={noteContent}
//           onChange={handleNoteChange}
//           placeholder="Edit your note here..."
//           rows={5}
//           cols={50}
//         ></textarea>
//         <br />
//         <button type="submit">Save Changes</button>
//       </form>
//     </div>
//   );
// }

// export default EditNote;
