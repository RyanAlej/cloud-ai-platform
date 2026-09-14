# find the latest ubuntu 24.04 LTS AMI
data "aws_ami" "ubuntu" {

  # only use official canonical ubuntu images
  owners = ["099720109477"]

  most_recent = true

  filter {

    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {

    name   = "virtualization-type"
    values = ["hvm"]
  }
}