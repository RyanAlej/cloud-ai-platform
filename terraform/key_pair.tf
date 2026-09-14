# import our existing public SSH key into AWS
resource "aws_key_pair" "project_key" {

  # name shown in the AWS console
  key_name = "project-key"

  # read our public key file from the local computer
  public_key = file(var.public_key_path)
}