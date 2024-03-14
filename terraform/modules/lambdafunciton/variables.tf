variable "region" {
  description = "The AWS region for the Lambda function"
  type        = string
}

variable "function_name" {
  description = "The name of the Lambda function"
  type        = string
}

variable "handler" {
  description = "The function entrypoint in your code."
  type        = string
}

variable "runtime" {
  description = "The runtime for the Lambda function"
  type        = string
}

variable "role_arn" {
  description = "The ARN of the IAM role that Lambda assumes"
  type        = string
}

variable "source_code_hash" {
  description = "Used to trigger updates. A base64-encoded SHA256 hash of the package file specified with the filename argument."
  type        = string
}

variable "filename" {
  description = "The path to the Lambda function's deployment package within the local filesystem."
  type        = string
}

variable "sns_topic_arn" {
  description = "ARN of the SNS topic to which the Lambda function will publish."
  type        = string
}
