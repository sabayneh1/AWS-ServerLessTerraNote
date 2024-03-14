resource "aws_iam_role" "lambda_exec_role_prod" {
  name = "${var.function_name}_exec_role_prod"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com",
        },
      },
    ],
  })
}

resource "random_string" "cognito_sms_external_id_prod" {
  length  = 16
  special = false
  upper   = false
}

resource "aws_iam_role" "cognito_sms_role_prod" {
  name = "CognitoSMSRoleProd"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "cognito-idp.amazonaws.com",
        },
        Action = "sts:AssumeRole",
        Condition = {
          StringEquals = {
            "sts:ExternalId": random_string.cognito_sms_external_id_prod.result
          }
        }
      },
    ],
  })
}

resource "aws_iam_policy" "s3_put_policy_prod" {
  name        = "S3PutObjectPolicyProd"
  description = "Policy for generating pre-signed URLs to put objects in S3"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = "s3:PutObject",
        Effect   = "Allow",
        Resource = "arn:aws:s3:::${var.presigned_urls_bucket_name_prod}/*",
      },
    ],
  })
}

resource "aws_iam_role" "chalice_lambda_role_prod" {
  name = "ChaliceLambdaExecutionRoleProd"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com",
        },
      },
    ],
  })
}

resource "aws_iam_role_policy" "lambda_logs_policy_prod" {
  name = "LambdaLogsPolicyProd"
  role = aws_iam_role.chalice_lambda_role_prod.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:*:*:*"
      },
    ],
  })
}


data "aws_iam_policy_document" "s3_policy_prod" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::${var.s3_bucket_name_prod}/*"
                #  "arn:aws:s3:::${var.presigned_urls_bucket_name}/*"
    ]

    principals {
      type        = "AWS"
      identifiers = [var.oai_iam_arn]
    }
  }
}


resource "aws_iam_policy" "lambda_s3_access_prod" {
  name        = "LambdaS3AccessPolicyProd"
  description = "Policy for Lambda to access S3 for pre-signed URLs"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
        ],
        Effect   = "Allow",
        Resource = [
          "arn:aws:s3:::${var.presigned_urls_bucket_name_prod}/*",
        ],
      },
    ],
  })
}



# Add additional policy attachments as necessary for DynamoDB, S3, etc.

resource "aws_iam_role_policy_attachment" "s3_put_policy_attachment_prod" {
  role       = aws_iam_role.chalice_lambda_role_prod.name
  policy_arn = aws_iam_policy.s3_put_policy_prod.arn
}



resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy_prod" {
  role       = aws_iam_role.lambda_exec_role_prod.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}
resource "aws_iam_role_policy_attachment" "lambda_chalice_dynamodb_policy_prod" {
  role       = aws_iam_role.chalice_lambda_role_prod.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}
resource "aws_iam_role_policy_attachment" "lambda_sns_policy_prod" {
  role       = aws_iam_role.lambda_exec_role_prod.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSNSFullAccess"
}

# Use a managed policy for Cognito SMS functionality
resource "aws_iam_role_policy_attachment" "cognito_sms_sns_full_access_prod" {
  role       = aws_iam_role.cognito_sms_role_prod.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSNSFullAccess"  # Corrected to a valid managed policy ARN
}


resource "aws_s3_bucket_policy" "react_bucket_policy_prod" {
  bucket = var.react_bucket_name_prod  # Use the corrected variable that actually contains the bucket name
  policy = data.aws_iam_policy_document.s3_policy_prod.json
}

resource "aws_iam_role_policy_attachment" "lambda_s3_policy_attachment" {
  role       = aws_iam_role.chalice_lambda_role_prod.name
  policy_arn = aws_iam_policy.lambda_s3_access_prod.arn
}
