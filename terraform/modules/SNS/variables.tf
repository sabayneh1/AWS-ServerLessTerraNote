variable "sns_topics" {
  description = "A map of SNS topic names and their display names"
  type = map(object({
    display_name = string
  }))
  default = {
    "user_registration" = {
      display_name = "User Registration Notifications"
    },
    "note_creation" = {
      display_name = "Note Creation Notifications"
    }
  }
}


variable "sns_subscriptions" {
  default = {
    "user_registration_subscription" = {
      topic_key = "user_registration"  # Ensure this matches a key in `sns_topics`
      email     = "samgtest0429@gmail.com"
    }
    // Add subscriptions for other topics as needed
  }
}

