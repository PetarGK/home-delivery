terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.14.0"
    }
  }

  backend "s3" {
    bucket         = "home-delivery-dev-tf-state"
    key            = "infra/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "home-delivery-dev-tf-locking"
    encrypt        = true
  }
}

provider "aws" {
  region = var.region
}
