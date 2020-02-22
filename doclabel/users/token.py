class TokenStrategy:
    @classmethod
    def obtain(cls, user):
        from rest_framework.authtoken.models import Token

        token, _ = Token.objects.get_or_create(user=user)
        return {"access": token.key}
