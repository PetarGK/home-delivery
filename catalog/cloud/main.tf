data "archive_file" "lambda_archive" {
  type = "zip"

  source_file = var.bin_path
  output_path = "lambda.zip"
}

resource "aws_iam_role" "lambda_execution_role" {
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_execution_policy" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "lambda" {
  function_name = var.service_name

  source_code_hash = data.archive_file.lambda_archive.output_base64sha256
  filename         = data.archive_file.lambda_archive.output_path

  handler = "func"
  runtime = "provided"
  environment {
    variables = {
      "RUST_LOG" = "debug"
    }
  }

  role = aws_iam_role.lambda_execution_role.arn
}


resource "aws_lambda_function_url" "function_url" {
  function_name      = aws_lambda_function.lambda.function_name
  authorization_type = "NONE"
}
