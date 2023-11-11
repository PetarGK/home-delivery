module "terraform_state" {
  source            = "../../../modules/data/terraform-backend"
  devops_state_name = var.devops_state_name
  region            = var.region
}
