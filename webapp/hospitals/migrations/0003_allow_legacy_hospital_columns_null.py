from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("hospitals", "0002_reconcile_hospital_schema"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE hospitals_hospital
                    ALTER COLUMN hospital_logo DROP NOT NULL,
                    ALTER COLUMN description DROP NOT NULL,
                    ALTER COLUMN is_verified DROP NOT NULL,
                    ALTER COLUMN admin_id DROP NOT NULL;
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]