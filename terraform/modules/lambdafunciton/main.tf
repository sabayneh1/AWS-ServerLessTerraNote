#Package Your Lambda Function: Before deploying, make sure to package your Lambda function code into a ZIP file (lambda_function.zip) and place it in the appropriate directory.
#Deploy: Run terraform init to initialize your Terraform configuration, then terraform apply to create the resources.

resource "aws_lambda_function" "notebook_prod" {
  function_name    = var.function_name
  handler          = var.handler
  runtime          = var.runtime
  role             = var.role_arn
  filename         = var.filename
  source_code_hash = var.source_code_hash

  environment {
    variables = {
      SNS_TOPIC_ARN = var.sns_topic_arn
    }
  }
}


