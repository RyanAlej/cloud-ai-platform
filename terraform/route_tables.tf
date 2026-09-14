resource "aws_route_table" "public_route_table" {

  # attach this route table to the VPC
  vpc_id = aws_vpc.project_vpc.id

  # send all internet traffic through the IGW
  route {

    # matches all IPv4 addresses
    cidr_block = "0.0.0.0/0"

    # send that traffic through the IGW using the IGW id/name
    gateway_id = aws_internet_gateway.project_igw.id
  }

  # add tags for easier identification in AWS
  tags = {

    Name = "public-route-table"
  }
}

# connect the public subnet to the public route table
resource "aws_route_table_association" "public_subnet_1_association" {

  # choose which subnet uses this route table
  subnet_id = aws_subnet.public_subnet_1.id

  # choose which route table is attached to that subnet
  route_table_id = aws_route_table.public_route_table.id
}

# route table for private subnets
resource "aws_route_table" "private_route_table" {

  # attach this route table to the VPC using name/id
  vpc_id = aws_vpc.project_vpc.id

  # send all internet traffic through the NAT gateway
  route {

    # match all IPv4 destinations
    cidr_block = "0.0.0.0/0"

    # route outbound trafic through the NAT gateway
    nat_gateway_id = aws_nat_gateway.project_nat_gateway.id
  }

  tags = {

    Name = "private-route-table"
  }
}

# connect the private subnet to the private route table
resource "aws_route_table_association" "private_subnet_1_association" {

  # choose which subnet uses this route table
  subnet_id = aws_subnet.private_subnet_1.id

  # choose which route table is attached to that subnet
  route_table_id = aws_route_table.private_route_table.id
}