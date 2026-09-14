terraform {

  # required_providers = which providers does this project need?
  required_providers {

    # this defines the AWS provider
    aws = {

      # download the AWS provider maintained by HashiCorp
      source = "hashicorp/aws"

      # version constraint = use version 6.x. NOT version 7
      version = "~> 6.0"
    }
  }

  # this requires Terraform to be 1.5 or newer
  required_version = ">= 1.5.0"
}

# everything I am about to build belongs to AWS
provider "aws" {

  # variable for AWS region for later
  region = var.aws_region
}