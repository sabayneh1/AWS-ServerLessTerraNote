import boto3
from chalice import Chalice

app = Chalice(app_name='notes-app')

def get_app_db():
    dynamodb = boto3.resource('dynamodb')
    table_name = 'NotesTable'  # Adjust with your actual table name, possibly configured through an environment variable
    return dynamodb.Table(table_name)
