# Assuming $CODEBUILD_SRC_DIR points to the root of your repo clone in CodeBuild

TERRAFORM_DIR="$CODEBUILD_SRC_DIR/terraform"
REACT_APP_DIR="$CODEBUILD_SRC_DIR/reactApp/my-notes-app"
OUTPUTS_DIR="$CODEBUILD_SRC_DIR/build_outputs" # New directory for storing output files

echo "Navigating to Terraform directory: $TERRAFORM_DIR"
cd "$TERRAFORM_DIR"

echo "Initializing and applying Terraform configuration..."
terraform init -reconfigure -input=false
terraform apply -auto-approve

# Store Terraform output values in variables
COGNITO_USER_POOL_ID=$(terraform output -raw cognito_user_pool_id)
COGNITO_USER_POOL_CLIENT_ID=$(terraform output -raw cognito_user_pool_client_id)

# Save outputs to a file
mkdir -p "$OUTPUTS_DIR" # Ensure the directory exists
echo "REACT_APP_COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID" > "$OUTPUTS_DIR/terraform_outputs.env"
echo "REACT_APP_COGNITO_USER_POOL_CLIENT_ID=$COGNITO_USER_POOL_CLIENT_ID" >> "$OUTPUTS_DIR/terraform_outputs.env"
ls 
