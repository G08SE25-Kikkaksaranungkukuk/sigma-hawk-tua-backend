#!/bin/bash
# Deploy script for Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${1:-your-gcp-project-id}"
REGION="${2:-asia-southeast1}"
IMAGE_TAG="${3:-latest}"
ENVIRONMENT="${4:-development}"

APP_NAME="sigma-hawk-tua-backend"
REPOSITORY_NAME="${APP_NAME}-repo"
IMAGE_NAME="${APP_NAME}"

echo -e "${GREEN}Starting deployment to Cloud Run${NC}"
echo "Project ID: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo "Environment: ${ENVIRONMENT}"
echo "Image Tag: ${IMAGE_TAG}"
echo ""

# Authenticate with GCP
echo -e "${YELLOW}Authenticating with GCP...${NC}"
gcloud auth login
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo -e "${YELLOW}Enabling required GCP APIs...${NC}"
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  sqladmin.googleapis.com \
  compute.googleapis.com \
  vpcaccess.googleapis.com \
  secretmanager.googleapis.com

# Build and push Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
gcloud builds submit \
  --tag ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${IMAGE_NAME}:${IMAGE_TAG} \
  --dockerfile Dockerfile.cloudrun \
  .

echo -e "${GREEN}Docker image built successfully!${NC}"

# Initialize Terraform
echo -e "${YELLOW}Initializing Terraform...${NC}"
cd terraform
terraform init

# Plan Terraform changes
echo -e "${YELLOW}Planning Terraform changes...${NC}"
terraform plan \
  -var="project_id=${PROJECT_ID}" \
  -var="region=${REGION}" \
  -var="environment=${ENVIRONMENT}" \
  -var="image_tag=${IMAGE_TAG}" \
  -out=tfplan

# Apply Terraform
echo -e "${YELLOW}Applying Terraform changes...${NC}"
read -p "Do you want to apply these changes? (yes/no): " CONFIRM
if [ "$CONFIRM" = "yes" ]; then
  terraform apply tfplan
  
  # Get outputs
  echo -e "${GREEN}Deployment successful!${NC}"
  echo ""
  echo "Cloud Run URL:"
  terraform output cloud_run_url
  echo ""
  echo "API Documentation:"
  terraform output api_documentation_url
  echo ""
  echo "Health Check:"
  terraform output health_check_url
else
  echo -e "${RED}Deployment cancelled${NC}"
  exit 1
fi

cd ..

echo -e "${GREEN}Deployment completed successfully!${NC}"
