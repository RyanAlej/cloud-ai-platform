###############################################################################
# THIS FILE IS SAYING WHAT TERRAFORM EXPECTS NOT ACUALLY ASSIGNING VALUES YET
###############################################################################


variable "aws_region" {

  # for humans
  description = "AWS region to deploy resources"

  # for Terraform
  type = string
}

# ec2 instance size used for the application server 
variable "instance_type" {

  # explains what value this variable should contain
  description = "EC2 instance type for the application server"

  # instance types such as t3.micro are stored as text
  type = string
}

variable "public_key_path" {

  # explains what this variable contains
  description = "Path to the SSH public key"

  # file path is stored as text
  type = string
}