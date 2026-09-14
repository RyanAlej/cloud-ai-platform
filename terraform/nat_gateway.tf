# reserve a static public IPv4 address for the NAT gateway
resource "aws_eip" "nat_eip" {

  # reserve this public IP so it can be attached to a resource inside a VPC
  domain = "vpc"

  tags = {

    Name = "nat-elastic-ip"
  }
}

# NAT Gateway = lets private resources start connetions to the internet, but it does NOT allow...
# the internet to start connections back
resource "aws_nat_gateway" "project_nat_gateway" {

  # attach the reserved elastic IP to this NAT gateway using id/name
  allocation_id = aws_eip.nat_eip.id

  # place the NAT gateway inside the public subnet
  subnet_id = aws_subnet.public_subnet_1.id

  tags = {

    Name = "project_nat_gateway"
  }

  # create the IGW before creating the NAT gateway
  depends_on = [aws_internet_gateway.project_igw]
}