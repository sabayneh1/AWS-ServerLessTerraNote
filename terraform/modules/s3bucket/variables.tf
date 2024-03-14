variable "bucket_name_prod" {
  description = "The name of the S3 bucket"
  type        = string
  default     = "notebook-prod"  # Adjust to ensure uniqueness
}

variable "index_document" {
  description = "The S3 bucket index document"
  default     = "index.html"
}

variable "error_document" {
  description = "The S3 bucket error document"
  default     = "error.html"
}

variable "tags" {
  description = "Tags to apply to the S3 bucket"
  type        = map(string)
  default     = {}
}
