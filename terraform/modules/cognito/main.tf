resource "aws_cognito_user_pool" "main" {
  name = var.user_pool_name

  password_policy {
    minimum_length    = var.password_policy.minimum_length
    require_lowercase = var.password_policy.require_lowercase
    require_numbers   = var.password_policy.require_numbers
    require_symbols   = var.password_policy.require_symbols
    require_uppercase = var.password_policy.require_uppercase
  }

  auto_verified_attributes = ["email"]

  mfa_configuration = "OPTIONAL"

  email_verification_message = "Your verification code is {####}."
  email_verification_subject = "Your Verification Code"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  user_pool_add_ons {
    advanced_security_mode = "AUDIT"
  }

  sms_configuration {
    external_id    = var.cognito_sms_external_id
    sns_caller_arn = var.sns_caller_arn
  }

  // Note: Ensure that the lambda_config block, if used, is correctly configured here
  // Include other configurations as needed
}

resource "aws_cognito_user_pool_client" "app_client" {
  name                                 = "appClient"
  user_pool_id                         = aws_cognito_user_pool.main.id
  generate_secret                      = false
  explicit_auth_flows                  = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  supported_identity_providers         = ["COGNITO"]
  callback_urls = ["https://${var.cloudfront_domain_name}/callback"]
  logout_urls = ["https://${var.cloudfront_domain_name}/logout"]
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid"]
  allowed_oauth_flows_user_pool_client = true

}



# resource "aws_cognito_user_pool_client" "my_user_pool_client" {
#   name = "my-client"
#   user_pool_id = aws_cognito_user_pool.main.id

#   explicit_auth_flows = ["USER_PASSWORD_AUTH"]
# }

# resource "aws_cognito_user_pool_user" "my_user" {
#   user_pool_id = aws_cognito_user_pool.main.id
#   username     = "samgtest0429@gmail.com"

#   message_action = "SUPPRESS"

#   password = "Password123!"
# }
