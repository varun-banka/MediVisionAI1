from django.db import migrations


def create_missing_tables(apps, schema_editor):
    existing_tables = set(schema_editor.connection.introspection.table_names())
    hospital_models = apps.get_app_config("hospitals").get_models()

    for model in hospital_models:
        table_name = model._meta.db_table
        if table_name not in existing_tables:
            schema_editor.create_model(model)
            existing_tables.add(table_name)


class Migration(migrations.Migration):
    dependencies = [
        ("hospitals", "0003_allow_legacy_hospital_columns_null"),
    ]

    operations = [
        migrations.RunPython(
            create_missing_tables,
            reverse_code=migrations.RunPython.noop,
        ),
    ]