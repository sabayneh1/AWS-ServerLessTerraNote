#!/bin/bash

# Source the environment variables including API URL
source terraform_outputs.env

# Replace the hardcoded API URLs with the environment variable
# Example: Getting a note
curl -i "${API_URL}/notes/{note_id}"

# Adding a new note
curl -X POST "${API_URL}/notes" -H "Content-Type: application/json" -d '{"noteId": "sampleNoteId", "content": "This is a sample note content."}'

# Another example of adding a note
curl -X POST "${API_URL}/notes" -H "Content-Type: application/json" -d '{"noteId": "2", "content": "This is a test note"}'

# Example of getting a note by ID
curl "${API_URL}/notes/2"

# Example of generating a pre-signed URL for file upload
curl -X POST "${API_URL}/generate-presigned-url/upload" -H "Content-Type: application/json" -d '{"file_name": "testNumber2.txt"}'
