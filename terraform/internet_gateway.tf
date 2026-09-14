# IGW allows the public subnets in the VPC to communicate with the Internet
resource "aws_internet_gateway" "project_igw" {

  # attach this IGW to the VPC using the VPC id/name
  vpc_id = aws_vpc.project_vpc.id

  tags = {

    Name = "project-internet-gateway"
  }
}