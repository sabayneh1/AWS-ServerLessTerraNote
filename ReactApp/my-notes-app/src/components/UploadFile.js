/**
 * Functional component that allows users to upload a file to a server using presigned URLs.
 * @returns JSX element containing file input and upload button
 */
import React, { useState } from 'react';

/**
 * Functional component for uploading a file.
 * Sets the selected file using useState hook and provides a way to handle file upload.
 * @returns JSX element containing file input and upload button.
 */
const UploadFile = () => {
  const [file, setFile] = useState(null);  // 

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    try {

      const apiUrl  = process.env.REACT_APP_API_BASE_URL;


      // Fetch presigned URL
      const presignedUrlResponse = await fetch(`${apiUrl}/generate-presigned-url/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_name: file.name }),
      });

      if (!presignedUrlResponse.ok) {
        throw new Error(`Failed to get presigned URL: ${presignedUrlResponse.status}`);
      }

      const { url } = await presignedUrlResponse.json();

      // Upload the file
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      console.log('Upload successful');
    } catch (error) {
      console.error('Error during file upload:', error);
      if (error.message.includes('Failed to get presigned URL')) {
        alert('There was an issue getting permission to upload. Please try again or contact support.');
      } else if (error.message.includes('Upload failed')) {
        alert('An error occurred during the upload. Please check your network connection and try again.');
      } else {
        alert('An unexpected error occurred. Please try again or contact support.');
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadFile;
