resource "aws_sns_topic" "sns_topic" {
  for_each = var.sns_topics

  name         = each.key
  display_name = each.value.display_name
}

resource "aws_sns_topic_subscription" "sns_subscription" {
  for_each = var.sns_subscriptions

  topic_arn = aws_sns_topic.sns_topic[each.value.topic_key].arn
  protocol  = "email"
  endpoint  = each.value.email
}


#create subscription
