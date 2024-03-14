#!/bin/bash

# Assuming $CODEBUILD_SRC_DIR points to the root of your Terraform directory
cd "$CODEBUILD_SRC_DIR/terraform" || exit

# Fetch Terraform outputs dynamically
COGNITO_USER_POOL_ID=$(terraform output -raw cognito_user_pool_id)
S3_BUCKET_NAME_FOR_FILES=$(terraform output -raw s3_bucket_name_for_files)
S3_BUCKET_NAME_FOR_PRESIGNED_URLS=$(terraform output -raw s3_bucket_name_for_preassigned_urls)
# For CloudFront, fetching the domain name directly. Assuming you have a corresponding output for CloudFront's distribution ID if needed
CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME=$(terraform output -raw cloudfront_distribution_domain_name)

# Existence Checks
echo "Checking for Cognito User Pool..."
aws cognito-idp describe-user-pool --user-pool-id "$COGNITO_USER_POOL_ID"

echo "Checking for S3 Bucket for Files..."
aws s3api head-bucket --bucket "$S3_BUCKET_NAME_FOR_FILES"

echo "Checking for S3 Bucket for Pre-signed URLs..."
aws s3api head-bucket --bucket "$S3_BUCKET_NAME_FOR_PRESIGNED_URLS"

echo "Checking for CloudFront Distribution..."
# This command lists all distributions and uses jq to search for the domain name.
# Requires jq to be installed. Adjust if necessary for your validation needs.
aws cloudfront list-distributions | jq -r '.DistributionList.Items[] | select(.DomainName=="'"$CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME"'")'

echo "Tests completed."
