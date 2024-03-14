variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ca-central-1"
}

variable "user_pool_name" {
  description = "NoteBookProject"
  type        = string
}

variable "password_policy" {
  description = "Password policy for the Cognito User Pool"
  type = object({
    minimum_length    = number
    require_lowercase = bool
    require_numbers   = bool
    require_symbols   = bool
    require_uppercase = bool
  })
  default = {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }
}

variable "cognito_sms_external_id" {
  description = "External ID for the Cognito SMS IAM role"
  type        = string
  # You can provide a default value or ensure to pass this variable on terraform apply
}

variable "sns_caller_arn" {
  description = "The ARN of the IAM role for Amazon Cognito to send SMS messages"
  type        = string
}


variable "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution"
  type        = string
}
