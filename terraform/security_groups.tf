# security group for the application server
resource "aws_security_group" "app_sg" {

  # display the name shown in AWS
  name = "app-security-group"

  # description of this security group for humans
  description = "Allow inbound web traffic"

  # attach this security group to our VPC
  vpc_id = aws_vpc.project_vpc.id

  tags = {

    Name = "app-security-group"
  }


  # from_port = 8000
  # to_port = 8010
  # this means the ingress allows ALL ports from 8000 to 8010


  # allow inbound HTTP traffic into EC2
  ingress {

    # allow from HTTP port
    from_port = 80

    # allow to HTTP port
    to_port = 80

    # network protocol
    protocol = "tcp"

    # allow traffic from anywhere on the internet
    cidr_blocks = ["0.0.0.0/0"]
  }

  # allow inbound HTTPS traffic into EC2
  ingress {

    # allow from HTTPS port
    from_port = 443

    # allow to HTTPS port
    to_port = 443

    # network protocol
    protocol = "tcp"

    # allow traffic from anywhere on the internet
    cidr_blocks = ["0.0.0.0/0"]
  }

  # allow inbbound SSH traffic into EC2
  ingress {

    # allow from SSH port
    from_port = 22

    # allow to SSH port
    to_port = 22

    # network protocol
    protocol = "tcp"

    # replace with your home public IP address
    cidr_blocks = ["0.0.0.0/0"]
  }

  # allow all outbound traffic leaving EC2
  egress {

    # starting port range that is allowed
    from_port = 0

    # ending port range that is allowed
    to_port = 0

    # allow all network protocols
    # -1 means allow every protocol (TCP, UDP, ICMP)
    protocol = "-1"

    # allow outbound traffic to any IPv4 destination
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {

    from_port = 8000

    to_port = 8000

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]
  }
}