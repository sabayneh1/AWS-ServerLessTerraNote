from chalice import Chalice, NotFoundError, BadRequestError, CORSConfig
import boto3
import logging
from chalice import Response
from chalice import Chalice, CORSConfig
from botocore.exceptions import ClientError


app = Chalice(app_name="notevault")
app.log.setLevel(logging.DEBUG)

# Customize your CORS settings
cors_config = CORSConfig(
    allow_origin='*',
    allow_headers=['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
    max_age=600
)
# Function to connect to the DynamoDB table
def get_app_db():
    dynamodb = boto3.resource('dynamodb')
    return dynamodb.Table('notebook_prod')

def error_handler(e):
    if isinstance(e, NotFoundError):
        return Response(body={'message': str(e)}, status_code=404)
    elif isinstance(e, db.meta.client.exceptions.ClientError):
        app.log.error(f"DynamoDB error: {e}")
        return BadRequestError("An error occurred while processing your request.")
    elif isinstance(e, client.exceptions.ClientError):
        app.log.error(f"S3 error: {e}")
        return BadRequestError("An error occurred while processing your request.")
    else:
        app.log.error(f"Unexpected error: {e}")
        return BadRequestError("An unexpected error occurred. Please try again.")

# Route to get a specific note
@app.route('/notes/{note_id}', methods=['GET'], cors=cors_config)
def get_note(note_id):
    app.log.debug(f"Fetching note with ID: {note_id}")
    db = get_app_db()
    try:
        response = db.get_item(Key={'noteId': note_id})
        if 'Item' not in response:
            raise NotFoundError('Note not found')
        return response['Item']
    except Exception as e:
        app.log.error(f"Error fetching note with ID {note_id}: {e}")
        raise error_handler(e)

# Route to create a new note
@app.route('/notes', methods=['POST'], cors=cors_config)
def create_note():
    app.log.debug("Creating a new note")
    note_data = app.current_request.json_body
    if 'noteId' not in note_data or 'content' not in note_data:
        raise BadRequestError('Missing noteId or content')

    db = get_app_db()
    item = {'noteId': note_data['noteId'], 'content': note_data['content']}

    try:
        # Add a condition expression to ensure the noteId does not already exist
        db.put_item(
            Item=item,
            ConditionExpression='attribute_not_exists(noteId)'
        )
        return item, 201
    except db.meta.client.exceptions.ConditionalCheckFailedException as e:
        app.log.error(f"Note with ID {item['noteId']} already exists: {e}")
        raise BadRequestError(f"Note with ID {item['noteId']} already exists.")
    except Exception as e:
        raise error_handler(e)


   # **New Route: Update Note**
@app.route('/notes/{note_id}', methods=['PUT'], cors=cors_config)
def update_note(note_id):
    app.log.debug(f"Updating note with ID: {note_id}")
    note_data = app.current_request.json_body
    if 'content' not in note_data:
        raise BadRequestError('Missing content')

    db = get_app_db()
    try:
        response = db.update_item(
            Key={'noteId': note_id},
            UpdateExpression='SET content = :val',
            ExpressionAttributeValues={
                ':val': note_data['content']
            },
            ReturnValues="ALL_NEW"
        )
        return response.get('Attributes', {}), 200
    except botocore.exceptions.ClientError as e:
        app.log.error(f"Error updating note with ID {note_id}: {e}")
        raise BadRequestError("An error occurred while updating the note. Please try again.")


BUCKET_NAME_FOR_FILES = "notebook-k9sudbzc-prod"
BUCKET_NAME_FOR_PRESIGNED_URL = "pre-asigned-url-serverless-web-9345-prod"

# Function to generate a pre-signed URL for uploading files
@app.route('/generate-presigned-url/upload', methods=['POST'], cors=cors_config)
def generate_presigned_url_for_upload():
    app.log.debug("Generating pre-signed URL for file upload")
    client = boto3.client('s3')
    file_name = app.current_request.json_body.get('file_name')
    if not file_name:
        raise BadRequestError('Missing file name')

    try:
        presigned_url = client.generate_presigned_url('put_object',
                                                      Params={'Bucket': BUCKET_NAME_FOR_PRESIGNED_URL,
                                                              'Key': file_name},
                                                      ExpiresIn=3600)
        return {'url': presigned_url}
    except client.exceptions.ClientError as e:
        app.log.error(f"S3 error generating pre-signed URL: {e}")
        raise BadRequestError("An error occurred while generating the upload URL. Please try again.")

# Function to upload a file directly to S3 (for backend use, if needed)
def upload_file_to_s3(file_path, file_name):
    app.log.debug(f"Uploading file '{file_name}' to S3")
    s3 = boto3.resource('s3')
    try:
        s3.Bucket(BUCKET_NAME_FOR_FILES).upload_file(Filename=file_path, Key=file_name)
    except s3.meta.client.exceptions.ClientError as e:
        app.log.error(f"S3 error uploading file: {e}")
        raise BadRequestError("An error occurred during the file upload. Please try again.")




##################################################################################################################################
# the below is the code chalice with congnito Authorizer


# from chalice import Chalice, CognitoUserPoolAuthorizer, NotFoundError, BadRequestError, UnauthorizedError
# import boto3
# import logging
# import os

# app = Chalice(app_name="notevaultProd")
# app.log.setLevel(logging.DEBUG)


# authorizer = CognitoUserPoolAuthorizer(
#     'NCPLproject',
#     provider_arns=['arn:aws:cognito-idp:ca-central-1:247867391235:userpool/ca-central-1_YqM82PSd7']
# )

# def is_app_running_locally():
#     return os.environ.get('IS_LOCAL', '') == 'false'
# # Function to connect to the DynamoDB table
# def get_app_db():
#     dynamodb = boto3.resource('dynamodb')
#     return dynamodb.Table('notebook_prod_prod')

# @app.route('/protected', methods=['GET'], authorizer=authorizer)
# def protected_route():

#     auth_header = app.current_request.to_dict().get('headers', {}).get('Authorization')
#     if not auth_header:
#         raise UnauthorizedError("Missing authorization token")

#     token = auth_header.split(" ")[1]
#     cognito = boto3.client('cognito-idp')
#     try:
#         response = cognito.get_user(AccessToken=token)
#         user_details = response['UserAttributes']
#         return {'message': 'This is a protected route'}
#     except cognito.exceptions.NotAuthorizedException:
#         raise UnauthorizedError("Invalid token")
#     except Exception as e:
#         raise UnauthorizedError("Authentication failed")

# # Function to connect to the DynamoDB table
# # def get_app_db():
# #     dynamodb = boto3.resource('dynamodb')
# #     return dynamodb.Table('notebook_prod_prod')

# # Route to get a specific note with authorization bypass for local environment
# @app.route('/notes/{note_id}', methods=['GET'], cors=True, authorizer=None if is_app_running_locally() else authorizer)
# def get_note(note_id):
#     """
#     Fetches a note from the database by its ID.
#     Logs debug information about the note ID being fetched.
#     Uses the get_app_db() function to connect to the DynamoDB table.
#     Raises NotFoundError if the note is not found.
#     Returns the note data if successful.
#     """
#     app.log.debug(f"Fetching note with ID: {note_id}")
#     db = get_app_db()
#     try:
#         response = db.get_item(Key={'noteId': note_id})
#         if 'Item' not in response:
#             raise NotFoundError('Note not found')
#         return response['Item']
#     except Exception as e:
#         raise NotFoundError('Note not found')

# # Route to update a note with authorization bypass for local environment
# @app.route('/notes/{note_id}', methods=['PUT'], cors=True, authorizer=None if is_app_running_locally() else authorizer)
# def update_note(note_id):
#     """
#     Updates a note in the database with new content.
#     Checks if the request body contains 'content' field, raising BadRequestError otherwise.
#     Uses the get_app_db() function to connect to the DynamoDB table.
#     Creates an item dictionary with the note ID and updated content.
#     Puts the item into the DynamoDB table.
#     Returns the updated item data.
#     """
#     note_data = app.current_request.json_body
#     if 'content' not in note_data:
#         raise BadRequestError('Missing content')

#     db = get_app_db()
#     item = {'noteId': note_id, 'content': note_data['content']}
#     db.put_item(Item=item)
#     return item

# # Route to delete a note with authorization bypass for local environment
# @app.route('/notes/{note_id}', methods=['DELETE'], cors=True, authorizer=None if is_app_running_locally() else authorizer)
# def delete_note(note_id):
#     """
#     Deletes a note from the database by its ID.
#     Uses the get_app_db() function to connect to the DynamoDB table.
#     Attempts to delete the item with the specified ID.
#     Returns a success message if deleted, otherwise raises NotFoundError.
#     """
#     db = get_app_db()
#     try:
#         db.delete_item(Key={'noteId': note_id})
#         return {'status': 'success', 'message': 'Note deleted successfully'}
#     except Exception as e:
#         raise NotFoundError('Note not found')

# # Route to create a new note with authorization
# @app.route('/notes', methods=['POST'], cors=True, authorizer=authorizer)
# def create_note():
#     """
#     Creates a new note in the database with given ID and content.
#     Checks if both 'noteId' and 'content' are present in the request body, raising BadRequestError otherwise.
#     Uses the get_app_db() function to connect to the DynamoDB table.
#     """


# BUCKET_NAME_FOR_FILES = "notebook_prod_prod-t3d3zdms"
# BUCKET_NAME_FOR_PRESIGNED_URL = "pre-asigned-url-serverless-web-9345"

# # Function to generate a pre-signed URL for uploading files
# @app.route('/generate-presigned-url/upload', methods=['POST'], cors=True, authorizer=authorizer)
# def generate_presigned_url_for_upload():
#     client = boto3.client('s3')
#     file_name = app.current_request.json_body.get('file_name')
#     if not file_name:
#         raise BadRequestError('Missing file name')

#     presigned_url = client.generate_presigned_url('put_object',
#                                                   Params={'Bucket': BUCKET_NAME_FOR_PRESIGNED_URL,
#                                                           'Key': file_name},
#                                                   ExpiresIn=3600)  # URL expires in 1 hour
#     return {'url': presigned_url}

# # Function to upload a file directly to S3 (for backend use, if needed)
# def upload_file_to_s3(file_path, file_name):
#     s3 = boto3.resource('s3')
#     s3.Bucket(BUCKET_NAME_FOR_FILES).upload_file(Filename=file_path, Key=file_name)

# # Add more functions as needed for downloading files, listing files in a bucket, etc.





#############################################################################################
#for test prupose


# from chalice import Chalice, CognitoUserPoolAuthorizer, NotFoundError, BadRequestError, UnauthorizedError
# import boto3
# import logging
# import os

# app = Chalice(app_name="notevault")
# app.log.setLevel(logging.DEBUG)


# def is_app_running_locally():
#     return os.environ.get('IS_LOCAL', '') == 'false'
# # Function to connect to the DynamoDB table
# def get_app_db():
#     dynamodb = boto3.resource('dynamodb')
#     return dynamodb.Table('notebook_prod_prod')

# @app.route('/test-protected', methods=['GET'])
# def test_protected_route():
#     # This is just for demonstration and testing purposes.
#     HARDCODED_TEST_TOKEN ="eyJraWQiOiJFXC9PajA3dVpEWTZBeEdFemdja20yWU5XYndFb1ZCVUtRbmNkZ3NLVURuST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwYzFkZDViOC1mMGMxLTcwZjItYTA3MS1kYWM4MGFlMGY0NDQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmNhLWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9jYS1jZW50cmFsLTFfWXFNODJQU2Q3IiwiY29nbml0bzp1c2VybmFtZSI6InNhbSIsIm9yaWdpbl9qdGkiOiJjMWU4ZjczOC1mNjBmLTQ2MmItODk1Ny04ODU2M2Q5OTAxNTgiLCJhdWQiOiJzZTBvMWMxcHNwZzlqZWZiYWRzM2o0YWczIiwiZXZlbnRfaWQiOiI1MGU3NTQ4NC1iY2Q2LTQyYjMtODM4My1lZmUwZTA2ZmY4NzciLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcwODkzNDc0MSwiZXhwIjoxNzA4OTUyNzQxLCJpYXQiOjE3MDg5MzQ3NDEsImp0aSI6IjU5NGJkMDM3LTc0NTMtNGIzMC1iYWRkLWRjMWI0YWMxODg3YyIsImVtYWlsIjoic2FtZ3Rlc3QwNDI5QGdtYWlsLmNvbSJ9.I6fI7_F_dPjzyBAzWOcKMSQvilYZg3Qz05tOsMU7LlOik7rjjl4xLQfRS_edh1E_dyBGCypiotuYNbkhBCMONDX_1d5YRhmyHnCvD-Q6emMqaygQb7DlCIdX3otad8XNeoW3uuVlteUzERSmwx2P6cx5l6_Ag3DqaYY_P06AgIbEnvzHzEjyQNgezBuE6NxdT3BTwfUTTu0VeDWKM2TMYWf6xZaHyHVMzzySFuqEPsiv1XtrTuNyr6OkWbzeS2t-XTtmxA8zXoALyMc-n5RK3m20Fb8OjgRtcX8wn9x7WVOOEDx6vWJw8rXyxzhx4h1dzOa6c1iGwWdyNk93UunsSA"

#     auth_header = app.current_request.to_dict().get('headers', {}).get('Authorization')

#     if not auth_header or auth_header.split(" ")[1] != HARDCODED_TEST_TOKEN:
#         return {'message': 'Unauthorized: Token is invalid or missing'}, 401

#     return {'message': 'This is a test protected route, auth succeeded'}


# # Function to connect to the DynamoDB table
# # def get_app_db():
# #     dynamodb = boto3.resource('dynamodb')
# #     return dynamodb.Table('notebook_prod_prod')

# # Route to get a specific note with authorization bypass for local environment
# @app.route('/notes/{note_id}', methods=['GET'], cors=True, authorizer=None)
# def get_note(note_id):
#     """
#     Fetches a note from the database by its ID.
#     Logs debug information about the note ID being fetched.
#     Uses the get_app_db() function to connect to the DynamoDB table.
#     Raises NotFoundError if the note is not found.
#     Returns the note data if successful.
#     """
#     app.log.debug(f"Fetching note with ID: {note_id}")
#     db = get_app_db()
#     try:
#         response = db.get_item(Key={'noteId': note_id})
#         if 'Item' not in response:
#             raise NotFoundError('Note not found')
#         return response['Item']
#     except Exception as e:
#         raise NotFoundError('Note not found')

# # Route to update a note with authorization bypass for local environment
# @app.route('/notes/{note_id}', methods=['PUT'], cors=True, authorizer=None)
# def update_note(note_id):
#     """
#     Updates a note in the database with new content.
#     Checks if the request body contains 'content' field, raising BadRequestError otherwise.
#     Uses the get_app_db() function to connect to the DynamoDB table.
#     Creates an item dictionary with the note ID and updated content.
#     Puts the item into the DynamoDB table.
#     Returns the updated item data.
#     """
#     note_data = app.current_request.json_body
#     if 'content' not in note_data:
#         raise BadRequestError('Missing content')

#     db = get_app_db()
#     item = {'noteId': note_id, 'content': note_data['content']}
#     db.put_item(Item=item)
#     return item

# # Route to delete a note with authorization bypass for local environment
# @app.route('/notes/{note_id}', methods=['DELETE'], cors=True, authorizer=None)
# def delete_note(note_id):
#     """
#     Deletes a note from the database by its ID.
#     Uses the get_app_db() function to connect to the DynamoDB table.
#     Attempts to delete the item with the specified ID.
#     Returns a success message if deleted, otherwise raises NotFoundError.
#     """
#     db = get_app_db()
#     try:
#         db.delete_item(Key={'noteId': note_id})
#         return {'status': 'success', 'message': 'Note deleted successfully'}
#     except Exception as e:
#         raise NotFoundError('Note not found')

# # Route to create a new note with authorization
# @app.route('/notes', methods=['POST'], cors=True,)
# def create_note():
#     """
#     Creates a new note in the database with given ID and content.
#     Checks if both 'noteId' and 'content' are present in the request body, raising BadRequestError otherwise.
#     Uses the get_app_db() function to connect to the DynamoDB table.
#     """


# BUCKET_NAME_FOR_FILES = "notebook_prod-t3d3zdms"
# BUCKET_NAME_FOR_PRESIGNED_URL = "pre-asigned-url-serverless-web-9345"

# # Function to generate a pre-signed URL for uploading files
# @app.route('/generate-presigned-url/upload', methods=['POST'], cors=True,)
# def generate_presigned_url_for_upload():
#     client = boto3.client('s3')
#     file_name = app.current_request.json_body.get('file_name')
#     if not file_name:
#         raise BadRequestError('Missing file name')

#     presigned_url = client.generate_presigned_url('put_object',
#                                                   Params={'Bucket': BUCKET_NAME_FOR_PRESIGNED_URL,
#                                                           'Key': file_name},
#                                                   ExpiresIn=3600)  # URL expires in 1 hour
#     return {'url': presigned_url}

# # Function to upload a file directly to S3 (for backend use, if needed)
# def upload_file_to_s3(file_path, file_name):
#     s3 = boto3.resource('s3')
#     s3.Bucket(BUCKET_NAME_FOR_FILES).upload_file(Filename=file_path, Key=file_name)

# # Add more functions as needed for downloading files, listing files in a bucket, etc.
