output "sns_topic_arns_prod" {
  value = { for key, topic in aws_sns_topic.sns_topic : key => topic.arn }
  description = "The ARNs of the created SNS topics"
}
