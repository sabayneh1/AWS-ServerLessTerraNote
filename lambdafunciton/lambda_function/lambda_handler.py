import boto3
import json
import decimal
import os
import logging

# Initialize logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize the SNS client
sns_client = boto3.client('sns')
sns_topic_arn = os.environ['SNS_TOPIC_ARN']  # Retrieve the SNS Topic ARN from environment variables

def lambda_handler(event, context):
    for record in event['Records']:
        if record['eventName'] == 'INSERT':
            new_image = record['dynamodb']['NewImage']
            message = json.dumps(new_image, cls=DecimalEncoder)

            try:
                # Attempt to publish message to SNS
                response = sns_client.publish(
                    TopicArn=sns_topic_arn,
                    Message=message,
                    Subject='New Item in DynamoDB'
                )
                logger.info(f"Message published to SNS with ID: {response['MessageId']}")
            except Exception as e:
                # Log the error and continue processing other records
                logger.error(f"Failed to publish message to SNS: {str(e)}")

    return {
        'statusCode': 200,
        'body': json.dumps('Successfully processed DynamoDB Stream event.')
    }

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)
