output "lambda_function_name" {
  description = "The name of the Lambda function"
  value       = aws_lambda_function.notebook_prod.function_name
}


