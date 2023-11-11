variable "region" {
  type        = string
  description = "AWS region where the resources will be deployed"
}

variable "devops_state_name" {
  type        = string
  description = "The name of the state which will be used to store terraform state"
}
