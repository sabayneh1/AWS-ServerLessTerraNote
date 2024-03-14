# resource "random_string" "bucket_suffix" {
#   length  = 8
#   special = false
#   # Result is lowercase, ensured by using the `lower` function when appending it to the bucket name.
# }

# resource "aws_s3_bucket" "bucket" {
#   bucket = "${var.bucket_name}-${lower(random_string.bucket_suffix.result)}"
#   tags   = var.tags
#   # Further configuration...
# }

resource "aws_s3_bucket" "bucket_prod" {
  bucket = "notebook-k9sudbzc-prod"
  tags   = var.tags
  # Further configuration...
}


# Adjust the block public access settings for the bucket
resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.bucket_prod.id

  block_public_acls   = false
  ignore_public_acls  = false
  block_public_policy = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.bucket_prod.id

  index_document {
    suffix = var.index_document
  }

  error_document {
    key = var.error_document
  }
}

resource "null_resource" "wait_before_policy" {
  triggers = {
    bucket_id = aws_s3_bucket.bucket_prod.id
  }

  provisioner "local-exec" {
    command = "sleep 30"
  }
}

resource "aws_s3_bucket_policy" "bucket_policy_prod" {
  depends_on = [
    aws_s3_bucket.bucket_prod,
    aws_s3_bucket_public_access_block.example,
    aws_s3_bucket_website_configuration.website,
    null_resource.wait_before_policy
  ]
  bucket = aws_s3_bucket.bucket_prod.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Sid       = "PublicReadGetObject",
      Effect    = "Allow",
      Principal = "*",
      Action    = "s3:GetObject",
      Resource  = "arn:aws:s3:::${aws_s3_bucket.bucket_prod.id}/*"
    }]
  })
}


resource "aws_s3_bucket" "my_bucket_prod" {
  bucket = "pre-asigned-url-serverless-web-9345-prod"
}

resource "aws_s3_bucket_cors_configuration" "my_bucket_cors_prod" {
  bucket = aws_s3_bucket.my_bucket_prod.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["*"] # Adjust according to your security requirements
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_cors_configuration" "bucket_cors_prod" {
  bucket = aws_s3_bucket.bucket_prod.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["*"] # Adjust according to your security requirements
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
