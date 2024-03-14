variable "table_name" {
  description = "Name of the DynamoDB table"
  type        = string
  default     = "notebook_prod" # Default value set
}

variable "hash_key" {
  description = "Hash key for the DynamoDB table"
  type        = string
  default     = "noteId" # Example hash key name
}

variable "attribute_definitions" {
  description = "Attribute definitions for the DynamoDB table"
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "noteId"
      type = "S"
    },
    # Add more attribute definitions as needed
  ]
}
variable "billing_mode" {
  description = "The billing mode for the DynamoDB table."
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "range_key" {
  description = "The range key of the DynamoDB table, if any."
  type        = string
  default     = ""
}



variable "read_max_capacity" {
  description = "The maximum read capacity for the DynamoDB autoscaling."
  type        = number
  default     = 100
}

variable "read_min_capacity" {
  description = "The minimum read capacity for the DynamoDB autoscaling."
  type        = number
  default     = 5
}

variable "read_target_value" {
  description = "The target value for read capacity autoscaling."
  type        = number
  default     = 70
}

variable "write_max_capacity" {
  description = "The maximum write capacity for the DynamoDB autoscaling."
  type        = number
  default     = 100
}

variable "write_min_capacity" {
  description = "The minimum write capacity for the DynamoDB autoscaling."
  type        = number
  default     = 5
}

variable "write_target_value" {
  description = "The target value for write capacity autoscaling."
  type        = number
  default     = 70
}

variable "scale_in_cooldown" {
  description = "The cooldown period before scaling in."
  type        = number
  default     = 60
}

variable "scale_out_cooldown" {
  description = "The cooldown period before scaling out."
  type        = number
  default     = 60
}

variable "gsi_read_max_capacity" {
  type        = number
  description = "The maximum read capacity for the Global Secondary Index (GSI)."
  default     = 10
}

variable "gsi_read_min_capacity" {
  type        = number
  description = "The minimum read capacity for the Global Secondary Index (GSI)."
  default     = 1
}

variable "gsi_read_target_value" {
  type        = number
  description = "The target value for read capacity utilization of the Global Secondary Index (GSI)."
  default     = 70
}

variable "gsi_scale_in_cooldown" {
  type        = number
  description = "The cooldown period for scaling in the Global Secondary Index (GSI)."
  default     = 300
}

variable "gsi_scale_out_cooldown" {
  type        = number
  description = "The cooldown period for scaling out the Global Secondary Index (GSI)."
  default     = 300
}




# variable "cognito_sms_external_id" {
#   description = "External ID for the Cognito SMS IAM role"
#   type        = string
#   # You can provide a default value or ensure to pass this variable on terraform apply
# }
