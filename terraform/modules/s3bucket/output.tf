output "bucket_name_prod" {
  value = aws_s3_bucket.bucket_prod.bucket
}
output "s3_bucket_name_for_preassigned_urls_prod" {
  value = aws_s3_bucket.my_bucket_prod.bucket
}


output "website_endpoint" {
  value = "http://${aws_s3_bucket.bucket_prod.bucket}.s3-website-${data.aws_region.current.name}.amazonaws.com"
}

data "aws_region" "current" {}

output "bucket_regional_domain_name" {
  value = aws_s3_bucket.bucket_prod.bucket_regional_domain_name
}

# output "s3_bucket_website_endpoint" {
#   value = aws_s3_bucket.bucket_prod.website_endpoint
# }



output "presigned_urls_bucket_name_prod" {
  value = aws_s3_bucket.my_bucket_prod.bucket
}

# Inside the s3bucket module

output "bucket_domain_name" {
  value = aws_s3_bucket.bucket_prod.bucket_domain_name
}


output "react_bucket_name_prod" {
  description = "The name of the first react bucket"
  value       = aws_s3_bucket.bucket_prod.id  # Assuming aws_s3_bucket.bucket refers to your React app bucket
}


# In modules/s3bucket/outputs.tf

output "bucket_id" {
  value = aws_s3_bucket.bucket_prod.id
}

output "bucket_arn" {
  value = aws_s3_bucket.bucket_prod.arn
}
