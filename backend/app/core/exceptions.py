from fastapi import HTTPException, status


class NotFoundError(HTTPException):
    def __init__(self, resource: str, id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "not_found", "message": f"{resource} '{id}' not found"},
        )


class ValidationError(HTTPException):
    def __init__(self, message: str, field: str | None = None):
        detail = {"error": "validation_error", "message": message}
        if field:
            detail["field"] = field
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)


class AuthenticationError(HTTPException):
    def __init__(self, message: str = "Invalid credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "authentication_error", "message": message},
            headers={"WWW-Authenticate": "Bearer"},
        )
