output "cloudfront_distribution_id" {
  description = "The identifier for the CloudFront distribution."
  value       = aws_cloudfront_distribution.s3_distribution.id
}

output "cloudfront_distribution_domain_name" {
  description = "The domain name corresponding to the distribution."
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}



output "oai_iam_arn" {
  value = aws_cloudfront_origin_access_identity.oai.iam_arn
}
