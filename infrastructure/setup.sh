#!/bin/bash

# Terraform Infrastructure Setup Script
# This script helps you set up the infrastructure for dev or prod environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Sigma Hawk Tua Backend - Infrastructure Setup         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if required tools are installed
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install: https://www.terraform.io/downloads"
        exit 1
    fi
    print_success "Terraform installed: $(terraform version | head -n 1)"
    
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is not installed. Please install: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    print_success "gcloud CLI installed: $(gcloud version | head -n 1)"
    
    # Check if authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
        print_warning "Not authenticated with gcloud. Running authentication..."
        gcloud auth login
        gcloud auth application-default login
    fi
    print_success "Authenticated with gcloud"
    
    echo ""
}

# Select environment
select_environment() {
    print_info "Select environment:"
    echo "  1) Development"
    echo "  2) Production"
    echo ""
    read -p "Enter choice [1-2]: " env_choice
    
    case $env_choice in
        1)
            ENVIRONMENT="dev"
            ENV_DIR="environments/dev"
            ;;
        2)
            ENVIRONMENT="prod"
            ENV_DIR="environments/prod"
            print_warning "⚠️  You are deploying to PRODUCTION!"
            read -p "Are you sure? (yes/no): " confirm
            if [ "$confirm" != "yes" ]; then
                print_error "Deployment cancelled"
                exit 0
            fi
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    print_success "Environment selected: $ENVIRONMENT"
    echo ""
}

# Setup configuration
setup_config() {
    print_info "Setting up configuration for $ENVIRONMENT..."
    
    cd "$ENV_DIR"
    
    if [ ! -f "terraform.tfvars" ]; then
        if [ -f "terraform.tfvars.example" ]; then
            cp terraform.tfvars.example terraform.tfvars
            print_warning "Created terraform.tfvars from example"
            print_warning "Please edit terraform.tfvars with your actual values"
            echo ""
            read -p "Press Enter after editing terraform.tfvars..."
        else
            print_error "terraform.tfvars.example not found"
            exit 1
        fi
    else
        print_success "terraform.tfvars already exists"
    fi
    
    echo ""
}

# Get project ID from tfvars
get_project_id() {
    PROJECT_ID=$(grep -E "^project_id" terraform.tfvars | cut -d'"' -f2)
    if [ -z "$PROJECT_ID" ]; then
        print_error "Could not find project_id in terraform.tfvars"
        exit 1
    fi
    print_info "Project ID: $PROJECT_ID"
    gcloud config set project "$PROJECT_ID"
}

# Enable required APIs
enable_apis() {
    print_info "Enabling required GCP APIs..."
    
    gcloud services enable \
        run.googleapis.com \
        cloudbuild.googleapis.com \
        artifactregistry.googleapis.com \
        sqladmin.googleapis.com \
        secretmanager.googleapis.com \
        cloudscheduler.googleapis.com \
        servicenetworking.googleapis.com \
        compute.googleapis.com \
        --project="$PROJECT_ID"
    
    print_success "APIs enabled"
    echo ""
}

# Initialize Terraform
init_terraform() {
    print_info "Initializing Terraform..."
    
    terraform init
    
    print_success "Terraform initialized"
    echo ""
}

# Plan Terraform
plan_terraform() {
    print_info "Planning Terraform changes..."
    
    terraform plan -out=tfplan
    
    print_success "Terraform plan created"
    echo ""
}

# Apply Terraform
apply_terraform() {
    print_warning "This will create infrastructure in GCP"
    read -p "Continue with terraform apply? (yes/no): " apply_confirm
    
    if [ "$apply_confirm" != "yes" ]; then
        print_error "Deployment cancelled"
        exit 0
    fi
    
    print_info "Applying Terraform changes..."
    
    terraform apply tfplan
    
    print_success "Terraform applied successfully!"
    echo ""
}

# Show outputs
show_outputs() {
    print_info "Deployment outputs:"
    echo ""
    
    terraform output
    
    echo ""
    print_success "Deployment complete!"
    echo ""
    
    CLOUD_RUN_URL=$(terraform output -raw cloud_run_url 2>/dev/null || echo "")
    if [ -n "$CLOUD_RUN_URL" ]; then
        echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}Service URL: ${CLOUD_RUN_URL}${NC}"
        echo -e "${GREEN}API Docs:    ${CLOUD_RUN_URL}/api-docs${NC}"
        echo -e "${GREEN}Health Check: ${CLOUD_RUN_URL}/healthz${NC}"
        echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    fi
}

# Main execution
main() {
    check_prerequisites
    select_environment
    setup_config
    get_project_id
    enable_apis
    init_terraform
    plan_terraform
    apply_terraform
    show_outputs
    
    echo ""
    print_info "Next steps:"
    echo "  1. Test the service: curl \$(terraform output -raw cloud_run_url)/healthz"
    echo "  2. View logs: gcloud run services logs tail \$(terraform output -raw cloud_run_service_name) --region=asia-southeast1"
    echo "  3. Trigger deployment: gcloud builds submit --config=cloudbuild.$ENVIRONMENT.yaml"
    echo ""
}

# Run main function
main
