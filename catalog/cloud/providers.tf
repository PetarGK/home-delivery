terraform {
  required_version = "~> 1.3"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.25"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4.0"
    }
  }

  backend "s3" {
    bucket         = "home-delivery-dev-tf-state"
    key            = "catalog/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "home-delivery-dev-tf-locking"
    encrypt        = true
  }
}

provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}
