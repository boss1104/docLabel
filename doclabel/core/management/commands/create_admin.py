from django.contrib.auth.management.commands import createsuperuser
from django.core.management import CommandError
from django.db import IntegrityError
from allauth.account.models import EmailAddress
from django.db import DatabaseError


class Command(createsuperuser.Command):
    help = "Non-interactively create an admin user"

    def add_arguments(self, parser):
        super().add_arguments(parser)
        parser.add_argument(
            "--password", default=None, help="The password for the admin."
        )

    def handle(self, *args, **options):
        password = options.get("password")
        username = options.get("username")
        email = options.get("email")

        if password and not username:
            raise CommandError("--username is required if specifying --password")

        if not email:
            raise CommandError("--email is required for login")

        try:
            super().handle(*args, **options)
        except IntegrityError:
            self.stderr.write(f"User {username} already exists.")

        if password:
            database = options.get("database")
            db = self.UserModel._default_manager.db_manager(database)
            user = db.get(username=username)
            user.set_password(password)
            user.save()
            # create email address model
            email = EmailAddress(
                user_id=user.id, email=email, verified=True, primary=True
            )
            try:
                email.save()
            except DatabaseError as db_error:
                self.stderr.write(self.style.ERROR(f'Datbase Error: "{db_error}"'))
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Email address created successfully "{email.email}"'
                    )
                )
