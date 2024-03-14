output "table_id" {
  value = aws_dynamodb_table.dynamodb_table.id
}

output "table_arn" {
  value = aws_dynamodb_table.dynamodb_table.arn
}
