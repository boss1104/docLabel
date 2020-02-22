from social_core.backends.gitlab import GitLabOAuth2
from social_core.backends.google import GoogleOAuth2
from social_core.backends.github import GithubOAuth2


class GitLabOAuth2Override(GitLabOAuth2):
    REDIRECT_STATE = False


class GoogleOAuth2Override(GoogleOAuth2):
    REDIRECT_STATE = False


class GithubOAuth2Override(GithubOAuth2):
    REDIRECT_STATE = False
