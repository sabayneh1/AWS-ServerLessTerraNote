variable "origin_domain_name" {
  description = "The DNS domain name of the S3 bucket or another origin."
  type        = string
}

variable "origin_id" {
  description = "A unique identifier for the origin."
  type        = string
}

variable "tags" {
  description = "A map of tags to assign to the resource."
  type        = map(string)
  default     = {}
}
variable "bucket_domain_name" {
  description = "The DNS domain name of the S3 bucket or another origin."
  type        = string
}


#  the two variables that is get from s3 bucke is need for the oai to make sure it is attached to the right bucket the variables are bucket_id and bucket_arn
# the two variables doesn't have to be mentioned in the "aws_cloudfront_origin_access_identity" "oai" terrafrom will attached them automaticaly as long as there are there

variable "bucket_id" {
  description = "The ID of the S3 bucket"
  type        = string
}

variable "bucket_arn" {
  description = "The ARN of the S3 bucket"
  type        = string
}
