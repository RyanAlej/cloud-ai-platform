resource "aws_subnet" "public_subnet_1" {

  vpc_id = aws_vpc.project_vpc.id

  cidr_block = "10.0.1.0/24"

  availability_zone = "us-east-1a"

  # automatically assign it a public IP because true
  map_public_ip_on_launch = true

  tags = {

    Name = "public-subnet-1"
  }
}

# private subnet for internal resources
resource "aws_subnet" "private_subnet_1" {

  # put this subnet inside the VPC
  vpc_id = aws_vpc.project_vpc.id

  # private IP range assigned to this subnet
  cidr_block = "10.0.2.0/24"

  #create this subnet in AZ us-east-1a
  availability_zone = "us-east-1a"

  # do NOT automatically assign public IPv4 addresses
  map_public_ip_on_launch = false

  tags = {

    Name = "private-subnets-1"
  }
}