output "lambda_exec_role_arn" {
  value = aws_iam_role.lambda_exec_role_prod.arn
}

output "cognito_sms_role_arn" {
  value = aws_iam_role.cognito_sms_role_prod.arn
}

output "cognito_sms_external_id" {
  value = random_string.cognito_sms_external_id_prod.result
}
