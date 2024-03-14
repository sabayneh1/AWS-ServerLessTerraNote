# output "dynamodb_table_arn" {
#   value = module.dynamodb_table.dynamodb_table_arn
# }


output "cognito_user_pool_id" {
  value       = module.cognito_user_pool.cognito_user_pool_id
  description = "The ID of the Cognito User Pool"
}

output "cognito_user_pool_client_id" {
  value       = module.cognito_user_pool.cognito_user_pool_client_id
  description = "The ID of the Cognito User Pool Client"
}

output "cloudfront_distribution_domain_name" {
  value       = module.cloudfront_for_react_app.cloudfront_distribution_domain_name
  description = "The domain name of the CloudFront distribution"
}

output "s3_bucket_name_for_files" {
  value       = module.s3_bucket_for_react_app.bucket_name_prod
  description = "The name of the S3 bucket for files"
}

output "s3_bucket_name_for_preassigned_urls" {
  value       = module.s3_bucket_for_react_app.s3_bucket_name_for_preassigned_urls_prod
  description = "The name of the S3 bucket for pre-assigned URLs"
}

# Add any other necessary resources or information as outputs
