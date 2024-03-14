variable "table_name" {
  description = "Name of the DynamoDB table"
  type        = string
  default     = "notebook-prod"  # Default value set
}

variable "hash_key" {
  description = "Hash key for the DynamoDB table"
  type        = string
  default     = "noteId"  # Example hash key name
}

variable "attribute_definitions" {
  description = "Attribute definitions for the DynamoDB table"
  type        = list(object({
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
  description = "Billing mode for the DynamoDB table"
  type        = string
}



variable "range_key" {
  description = "Range key for the DynamoDB table"
  type        = string
  default     = ""
}



variable "read_max_capacity" {
  description = "Maximum read capacity for DynamoDB autoscaling"
  type        = number
}

variable "read_min_capacity" {
  description = "Minimum read capacity for DynamoDB autoscaling"
  type        = number
}

variable "write_max_capacity" {
  description = "Maximum write capacity for DynamoDB autoscaling"
  type        = number
}

variable "write_min_capacity" {
  description = "Minimum write capacity for DynamoDB autoscaling"
  type        = number
}

variable "read_target_value" {
  description = "Target value for read capacity autoscaling"
  type        = number
}

variable "write_target_value" {
  description = "Target value for write capacity autoscaling"
  type        = number
}

variable "scale_in_cooldown" {
  description = "Cooldown period before scaling in"
  type        = number
}

variable "scale_out_cooldown" {
  description = "Cooldown period before scaling out"
  type        = number
}
variable "gsi_read_max_capacity" {
  type        = number
  description = "The maximum read capacity for the Global Secondary Index (GSI)."
}

variable "gsi_read_min_capacity" {
  type        = number
  description = "The minimum read capacity for the Global Secondary Index (GSI)."
}

variable "gsi_read_target_value" {
  type        = number
  description = "The target value for read capacity utilization of the Global Secondary Index (GSI)."
}

variable "gsi_scale_in_cooldown" {
  type        = number
  description = "The cooldown period for scaling in the Global Secondary Index (GSI)."
}

variable "gsi_scale_out_cooldown" {
  type        = number
  description = "The cooldown period for scaling out the Global Secondary Index (GSI)."
}
