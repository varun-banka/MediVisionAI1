from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("hospitals", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE hospitals_hospital
                    ADD COLUMN IF NOT EXISTS name varchar(255) NOT NULL DEFAULT 'Unnamed Hospital',
                    ADD COLUMN IF NOT EXISTS type varchar(50) NOT NULL DEFAULT 'general',
                    ADD COLUMN IF NOT EXISTS established_year varchar(4) NOT NULL DEFAULT '',
                    ADD COLUMN IF NOT EXISTS total_beds integer NOT NULL DEFAULT 0,
                    ADD COLUMN IF NOT EXISTS emergency_service varchar(10) NOT NULL DEFAULT 'no',
                    ADD COLUMN IF NOT EXISTS emergency_phone varchar(20) NOT NULL DEFAULT '',
                    ADD COLUMN IF NOT EXISTS website varchar(200) NOT NULL DEFAULT '',
                    ADD COLUMN IF NOT EXISTS country varchar(100) NOT NULL DEFAULT 'India',
                    ADD COLUMN IF NOT EXISTS administrator_name varchar(255) NOT NULL DEFAULT 'Hospital Administrator',
                    ADD COLUMN IF NOT EXISTS administrator_email varchar(254) NOT NULL DEFAULT '',
                    ADD COLUMN IF NOT EXISTS username varchar(150) NOT NULL DEFAULT '',
                    ADD COLUMN IF NOT EXISTS password varchar(255) NOT NULL DEFAULT '',
                    ADD COLUMN IF NOT EXISTS departments jsonb NOT NULL DEFAULT '[]'::jsonb,
                    ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

                CREATE UNIQUE INDEX IF NOT EXISTS hospitals_hospital_username_key
                    ON hospitals_hospital (username);
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]