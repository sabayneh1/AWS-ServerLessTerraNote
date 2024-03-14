#!/bin/bash

# The first argument is the API URL from the Chalice deployment
API_URL=$1
REACT_APP_DIR="$CODEBUILD_SRC_DIR/reactApp/my-notes-app"

# Navigate to React app directory
cd "$REACT_APP_DIR"

# Function to update or append variable in .env
update_or_append() {
    local key=$1
    local value=$2
    local file=$3
    grep -qE "^${key}=" "$file" && sed -i "s|^${key}=.*|${key}=${value}|" "$file" || echo "${key}=${value}" >> "$file"
}

echo "Updating .env in React app directory with API URL..."
update_or_append "REACT_APP_API_BASE_URL" "$API_URL" ".env"

echo "Verifying .env content..."
cat ".env"

# Configure Git for commits and push
git config --global user.name "AWS CodeBuild"
git config --global user.email "codebuild@example.com"

# Configure Git to use the AWS credential helper
git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true

# Ensure the Git remote URL is set to HTTPS
git remote set-url origin https://git-codecommit.ca-central-1.amazonaws.com/v1/repos/AWS-ServerlessTerraNote

# Staging the changes
git add .env

# Creating a commit with the changes
git commit -m "Update .env with Chalice API URL"

# Pushing the commit to the CodeCommit repository
git push origin HEAD:master

