# ubuntu EC2 instance that will host the application
resource "aws_instance" "app_server" {

  # ubuntu operating system image to install using AMI ubuntu name/id
  # look up data --> aws_ami is what were looking for --> ubuntu is name in ami.tf --> give the ID
  ami = data.aws_ami.ubuntu.id

  # virtual machine size (CPU and RAM) like t3.micro
  instance_type = var.instance_type

  # install this SSH key onto the ec2
  key_name = aws_key_pair.project_key.key_name

  # launch this ec2 inside the public subnet using public subnet name/id
  subnet_id = aws_subnet.public_subnet_1.id

  # attach the security group (firewall) using the sg name/id
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  # automatically assign a public IPv4 address
  associate_public_ip_address = true

  tags = {

    Name = "project-app-server"
  }
}