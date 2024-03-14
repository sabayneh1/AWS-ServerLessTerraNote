module "cognito_user_pool" {
  source                  = "./modules/cognito"
  user_pool_name          = "NCPLproject_prod"
  cognito_sms_external_id = module.iam_role.cognito_sms_external_id
  sns_caller_arn          = module.iam_role.cognito_sms_role_arn
  cloudfront_domain_name  = module.cloudfront_for_react_app.cloudfront_distribution_domain_name
  depends_on              = [module.cloudfront_for_react_app]
}



module "dynamodb_table" {
  source                 = "./modules/DynamoDb"
  table_name             = var.table_name
  billing_mode           = var.billing_mode
  hash_key               = var.hash_key
  range_key              = var.range_key
  attribute_definitions  = var.attribute_definitions
  read_max_capacity      = var.read_max_capacity
  read_min_capacity      = var.read_min_capacity
  read_target_value      = var.read_target_value
  write_max_capacity     = var.write_max_capacity
  write_min_capacity     = var.write_min_capacity
  write_target_value     = var.write_target_value
  scale_in_cooldown      = var.scale_in_cooldown
  scale_out_cooldown     = var.scale_out_cooldown
  gsi_read_min_capacity  = var.gsi_read_min_capacity
  gsi_read_target_value  = var.gsi_read_target_value
  gsi_read_max_capacity  = var.gsi_read_max_capacity
  gsi_scale_in_cooldown  = var.gsi_scale_in_cooldown
  gsi_scale_out_cooldown = var.gsi_scale_out_cooldown
}

module "iam_role" {
  source              = "./modules/IAMrole"
  function_name       = "mySecureNotebookFunction_prod"
  s3_bucket_name_prod = module.s3_bucket_for_react_app.bucket_name_prod
  # cognito_sms_external_id = var.cognito_sms_external_id
  presigned_urls_bucket_name_prod = module.s3_bucket_for_react_app.presigned_urls_bucket_name_prod
  oai_iam_arn                     = module.cloudfront_for_react_app.oai_iam_arn
  # preasigned_url_bucket_name = module.s3_bucket_for_react_app.presigned_url_bucket_name_prod
  react_bucket_name_prod = module.s3_bucket_for_react_app.react_bucket_name_prod
}



module "lambda_function" {
  source           = "./modules/lambdafunciton"
  region           = "ca-central-1"
  function_name    = "mySecureNotebookFunction_prod"
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  role_arn         = module.iam_role.lambda_exec_role_arn
  filename         = "../lambdafunciton/lambda_function.zip"
  source_code_hash = filebase64sha256("../lambdafunciton/lambda_function.zip")
  sns_topic_arn    = module.sns_topics.sns_topic_arns_prod["user_registration"]
  depends_on       = [module.sns_topics]
}


module "sns_topics" {
  source = "./modules/SNS"

  sns_topics = {
    "user_registration" = {
      display_name = "User Registration Notifications"
    },
    "note_creation" = {
      display_name = "Note Creation Notifications"
    }
  }

}


module "s3_bucket_for_react_app" {
  source = "./modules/s3bucket"

  #bucket_name = "notebook"
  tags = {
    Project     = "ReactApp"
    Environment = "Production"
  }
}


module "cloudfront_for_react_app" {
  source = "./modules/CloudFrontDistribution"

  origin_domain_name = module.s3_bucket_for_react_app.bucket_regional_domain_name
  origin_id          = "S3-${module.s3_bucket_for_react_app.bucket_name_prod}"
  tags = {
    Environment = "production"
  }
  bucket_domain_name = module.s3_bucket_for_react_app.bucket_domain_name
  depends_on         = [module.s3_bucket_for_react_app]
  bucket_id          = module.s3_bucket_for_react_app.bucket_id
  bucket_arn         = module.s3_bucket_for_react_app.bucket_arn

}

