variable "function_name" {
  description = "The name of the Lambda function"
  type        = string
}
# variable "cognito_sms_external_id_prod" {
#   description = "External ID for the Cognito SMS IAM role"
#   type        = string
#   # You can provide a default value or ensure to pass this variable on terraform apply
# }


# Inside the IamRole module

variable "s3_bucket_name_prod" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "presigned_urls_bucket_name_prod" {
  description = "The name of the S3 bucket"
  type        = string
}

# Inside your IAMRole module (e.g., modules/IAMrole/variables.tf)

variable "oai_iam_arn" {
  description = "The IAM ARN for the CloudFront Origin Access Identity"
  type        = string
}


variable "react_bucket_name_prod" {
  description = "The ID of the first S3 bucket"
  type        = string
}

# variable "preasigned_url_bucket_name" {
#   description = "The ID of the second S3 bucket"
#   type        = string
# }
