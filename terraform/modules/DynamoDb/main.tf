resource "aws_dynamodb_table" "dynamodb_table" {
  name          = var.table_name
  billing_mode  = var.billing_mode
  hash_key      = var.hash_key
  range_key     = var.range_key

  attribute {
    name = var.hash_key
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  dynamic "attribute" {
    for_each = var.attribute_definitions
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  global_secondary_index {
    name               = "UserIdIndex"
    hash_key           = "userId"
    projection_type    = "ALL"
  }
  // Include existing attributes and configurations
}

resource "aws_appautoscaling_target" "dynamodb_read_target" {
  count              = var.billing_mode == "PROVISIONED" ? 1 : 0 # Conditional creation

  max_capacity       = var.read_max_capacity
  min_capacity       = var.read_min_capacity
  resource_id        = "table/${aws_dynamodb_table.dynamodb_table.name}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_target" "dynamodb_write_target" {
  count              = var.billing_mode == "PROVISIONED" ? 1 : 0 # Conditional creation

  max_capacity       = var.write_max_capacity
  min_capacity       = var.write_min_capacity
  resource_id        = "table/${aws_dynamodb_table.dynamodb_table.name}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "dynamodb_read_policy" {
  count = var.billing_mode == "PROVISIONED" ? 1 : 0 # Conditional creation

  name               = "dynamodb-read-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.dynamodb_read_target[0].resource_id
  scalable_dimension = aws_appautoscaling_target.dynamodb_read_target[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.dynamodb_read_target[0].service_namespace

  target_tracking_scaling_policy_configuration {
    target_value              = var.read_target_value
    scale_in_cooldown         = var.scale_in_cooldown
    scale_out_cooldown        = var.scale_out_cooldown
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }
  }
}

resource "aws_appautoscaling_policy" "dynamodb_write_policy" {
  count = var.billing_mode == "PROVISIONED" ? 1 : 0 # Conditional creation

  name               = "dynamodb-write-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.dynamodb_write_target[0].resource_id
  scalable_dimension = aws_appautoscaling_target.dynamodb_write_target[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.dynamodb_write_target[0].service_namespace

  target_tracking_scaling_policy_configuration {
    target_value              = var.write_target_value
    scale_in_cooldown         = var.scale_in_cooldown
    scale_out_cooldown        = var.scale_out_cooldown
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }
  }
}

resource "aws_appautoscaling_target" "dynamodb_gsi_read_target" {
  count              = var.billing_mode == "PROVISIONED" ? 1 : 0

  max_capacity       = var.gsi_read_max_capacity
  min_capacity       = var.gsi_read_min_capacity
  resource_id        = "table/${aws_dynamodb_table.dynamodb_table.name}/index/UserIdIndex"
  scalable_dimension = "dynamodb:index:ReadCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "dynamodb_gsi_read_policy" {
  count = var.billing_mode == "PROVISIONED" ? 1 : 0

  name               = "dynamodb-gsi-read-policy-${aws_dynamodb_table.dynamodb_table.name}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.dynamodb_gsi_read_target[0].resource_id
  scalable_dimension = aws_appautoscaling_target.dynamodb_gsi_read_target[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.dynamodb_gsi_read_target[0].service_namespace

  target_tracking_scaling_policy_configuration {
    target_value       = var.gsi_read_target_value
    scale_in_cooldown  = var.gsi_scale_in_cooldown
    scale_out_cooldown = var.gsi_scale_out_cooldown
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }
  }
}
