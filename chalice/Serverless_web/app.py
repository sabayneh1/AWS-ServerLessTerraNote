'''
NoteVault - A Serverless Note-Taking Application Powered by AWS

Created by: Samander

Description

This Chalice application provides a robust backend for a note-taking app. Key features include:

CRUD operations on notes: Create, Read, Update, Delete
Error handling: Gracefully handles various database and S3 errors.
File Uploads: Facilitates file uploads with pre-signed URLs for security.
Scalability: Leverages serverless functions for easy scaling.
'''
from chalice import Chalice, NotFoundError, BadRequestError, CORSConfig
import boto3
import logging
from chalice import Response
from botocore.exceptions import ClientError

# Initialize the Chalice app with a specific name for identification
app = Chalice(app_name="notevault")
# Set the logging level to DEBUG to see detailed logs. Helps in debugging.
app.log.setLevel(logging.DEBUG)

# CORS configuration to allow requests from any origin and specify allowed headers.
cors_config = CORSConfig(
    allow_origin='*',
    allow_headers=['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
    max_age=600
)

# Function to establish a connection with the DynamoDB table.
def get_app_db():
    dynamodb = boto3.resource('dynamodb')
    # Connects to the 'notebook_prod' DynamoDB table
    return dynamodb.Table('notebook_prod')

# Error handling function to manage different types of errors gracefully.
def error_handler(e):
    # NotFoundError indicates that the requested item does not exist.
    if isinstance(e, NotFoundError):
        return Response(body={'message': str(e)}, status_code=404)
    # Handling DynamoDB client errors.
    elif isinstance(e, ClientError) and 'DynamoDB' in str(e):
        app.log.error(f"DynamoDB error: {e}")
        return BadRequestError("An error occurred while processing your request.")
    # Handling S3 client errors.
    elif isinstance(e, ClientError) and 'S3' in str(e):
        app.log.error(f"S3 error: {e}")
        return BadRequestError("An error occurred while processing your request.")
    # Catch-all for unexpected errors.
    else:
        app.log.error(f"Unexpected error: {e}")
        return BadRequestError("An unexpected error occurred. Please try again.")

# Defines a route to retrieve a specific note by its ID.
@app.route('/notes/{note_id}', methods=['GET'], cors=cors_config)
def get_note(note_id):
    app.log.debug(f"Fetching note with ID: {note_id}")
    db = get_app_db()
    try:
        # Fetches the note from DynamoDB. If not found, raises NotFoundError.
        response = db.get_item(Key={'noteId': note_id})
        if 'Item' not in response:
            raise NotFoundError('Note not found')
        return response['Item']
    except Exception as e:
        app.log.error(f"Error fetching note with ID {note_id}: {e}")
        raise error_handler(e)

# Defines a route for creating a new note. Expects 'noteId' and 'content' in the request body.
@app.route('/notes', methods=['POST'], cors=cors_config)
def create_note():
    app.log.debug("Creating a new note")
    note_data = app.current_request.json_body
    if 'noteId' not in note_data or 'content' not in note_data:
        raise BadRequestError('Missing noteId or content')

    db = get_app_db()
    item = {'noteId': note_data['noteId'], 'content': note_data['content']}

    try:
        # Inserts the new note into DynamoDB, ensuring 'noteId' does not already exist.
        db.put_item(
            Item=item,
            ConditionExpression='attribute_not_exists(noteId)'
        )
        return item, 201
    except Exception as e:
        raise error_handler(e)

# Defines a route for updating an existing note's content by its ID.
@app.route('/notes/{note_id}', methods=['PUT'], cors=cors_config)
def update_note(note_id):
    app.log.debug(f"Updating note with ID: {note_id}")
    note_data = app.current_request.json_body
    if 'content' not in note_data:
        raise BadRequestError('Missing content')

    db = get_app_db()
    try:
        # Updates the 'content' of the note in DynamoDB and returns the new content.
        response = db.update_item(
            Key={'noteId': note_id},
            UpdateExpression='SET content = :val',
            ExpressionAttributeValues={
                ':val': note_data['content']
            },
            ReturnValues="ALL_NEW"
        )
        return response.get('Attributes', {}), 200
    except Exception as e:
        app.log.error(f"Error updating note with ID {note_id}: {e}")
        raise BadRequestError("An error occurred while updating the note. Please try again.")

# Constants for S3 bucket names
BUCKET_NAME_FOR_FILES = "notebook-k9sudbzc-prod"
BUCKET_NAME_FOR_PRESIGNED_URL = "pre-asigned-url-serverless-web-9345-prod"

@app.route('/generate-presigned-url/upload', methods=['POST'], cors=cors_config)
def generate_presigned_url_for_upload():
    """
    Generates a pre-signed URL for clients to upload files directly to an S3 bucket.
    This approach enhances security and performance by offloading the data transfer directly to S3.
    """
    app.log.debug("Generating pre-signed URL for file upload")
    client = boto3.client('s3')  # Initialize the S3 client
    file_name = app.current_request.json_body.get('file_name')
    # Validate file_name to ensure it's provided
    if not file_name:
        raise BadRequestError('Missing file name')

    try:
        # Generate the pre-signed URL for PUT operations, valid for 3600 seconds (1 hour)
        presigned_url = client.generate_presigned_url('put_object',
                                                      Params={'Bucket': BUCKET_NAME_FOR_PRESIGNED_URL,
                                                              'Key': file_name},
                                                      ExpiresIn=3600)
        return {'url': presigned_url}
    except client.exceptions.ClientError as e:
        app.log.error(f"S3 error generating pre-signed URL: {e}")
        raise BadRequestError("An error occurred while generating the upload URL. Please try again.")

def upload_file_to_s3(file_path, file_name):
    """
    Uploads a file directly to S3 from the front end.
    """
    app.log.debug(f"Uploading file '{file_name}' to S3")
    s3 = boto3.resource('s3')  # Initialize the S3 resource
    try:
        # Perform the file upload to the specified bucket
        s3.Bucket(BUCKET_NAME_FOR_FILES).upload_file(Filename=file_path, Key=file_name)
    except s3.meta.client.exceptions.ClientError as e:
        app.log.error(f"S3 error uploading file: {e}")
        raise BadRequestError("An error occurred during the file upload. Please try again.")
