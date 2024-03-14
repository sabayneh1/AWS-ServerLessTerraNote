output "user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "The ARN of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.arn
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.main.id
  description = "The ID of the Cognito User Pool"
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.app_client.id
  description = "The ID of the Cognito User Pool Client"
}


# output "test_user_username" {
#   value = aws_cognito_user_pool_user.my_user.username
# }

# output "test_user_password" {
#   value = "Password123!" # Be cautious with password management
# }
