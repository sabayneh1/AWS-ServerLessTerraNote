# **Secure Note Application: Developer Guide**

Welcome to the Secure Note Application project! This guide provides comprehensive instructions on setting up the project locally, building the React frontend, and understanding the continuous integration and delivery setup using AWS services. The Secure Note Application offers a robust platform for users to create, manage, and securely store notes.

## **Prerequisites**

Before you begin, ensure you have the following installed:

- Node.js and npm (Node Package Manager)
- AWS CLI (configured with appropriate access permissions)
- Git for version control

## **Setting Up the Project Locally**

1. **Clone the Repository**:
Start by cloning this repository to your local machine using Git.

    git clone https://github.com/sabayneh1/AWS-ServerLessTerraNote.git

2. **Install React and Dependencies**:
Use the following commands to set up your React application. This will install **`create-react-app`** globally, initialize a new React application, and install necessary dependencies including AWS Cognito for authentication and Axios for HTTP requests.

    npm install -g create-react-app
    npx create-react-app my-notes-app
    cd my-notes-app
    npm install axios react-router-dom amazon-cognito-identity-js
    npm install --save @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome


3. **Development Dependencies**:
Install Babel plugin and update react-scripts to the latest version for development purposes.

    npm install @babel/plugin-proposal-private-property-in-object --save-dev
    npm install react-scripts@latest

4. **Build the Application**:
Compile your application into static files for deployment.


    npm run build


    To build without cache, use:

    pm run build -- --clear-cache



5. **Local Testing**:
For development and testing purposes, you can start the application locally using:


    npm start


    This command runs the app in the development mode, making it accessible at http://localhost:3000 in your browser.


## **Continuous Integration and Delivery (CI/CD)**

This project uses AWS CodePipeline for CI/CD, automating the deployment process across different environments. Each service (Terraform infrastructure, Chalice backend, React frontend) has a corresponding **`buildspec.yml`** file that defines the build and deployment commands for AWS CodeBuild.

### **Test Pipeline**

Located at the root directory, the **`buildspec.yml`** for testing includes phases for installation, pre-build tests, build commands, and post-build actions. It ensures that every change pushed to the repository is automatically tested.

### **Production Pipeline**

Triggered upon manual approval in the test pipeline, the production pipeline deploys the application to the production environment. EventBridge and a Lambda function are used to automate the trigger between pipelines.

## **Build Specifications**

Each stage directory contains its own **`buildspec.yml`**, tailored for building that specific component of the project. These specifications include custom commands for deploying infrastructure with Terraform, updating AWS Lambda functions with Chalice, and deploying the React app.

## **Deployment Commands**

Ensure you navigate to the appropriate directory containing the **`buildspec.yml`** for the component you wish to deploy before running the following commands:

- **Terraform** (Infrastructure):

    terraform init

    terraform apply



- **Chalice** (Backend API):


    chalice deploy


- **React App** (Frontend):

    npm run build
    aws s3 sync build/ s3://your-react-app-bucket-name --acl public-read




## **Contributing**

Contributions to the Secure Note Application are welcome! Please follow the standard GitHub pull request process to submit your changes. Ensure you test your changes thoroughly and update the documentation as necessary.

Thank you for contributing to the Secure Note Application project. Your efforts help improve the security and functionality of this note-taking platform.
