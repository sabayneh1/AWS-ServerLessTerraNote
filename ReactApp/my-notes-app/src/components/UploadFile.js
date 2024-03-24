import React, { useState } from 'react';

const UploadFile = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    try {
      // Manually setting the API base URL
      const apiUrl  = process.env.REACT_APP_API_BASE_URL;
      // const apiUrl = "https://q36zfljb6j.execute-api.ca-central-1.amazonaws.com/api";

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
