terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket-ca-25576-prod"
    key            = "state/terraform.tfstate"
    region         = "ca-central-1"
    dynamodb_table = "my-terraform-state-bucket-ca-25576-prod"
    encrypt        = true
  }
}
