variable "region" {
  type        = string
  description = "AWS region where the resources will be deployed"
}

variable "service_name" {
  type        = string
  description = "Name of the service"
}

variable "bin_path" {
  type        = string
  description = "Bin path to build output"
}
