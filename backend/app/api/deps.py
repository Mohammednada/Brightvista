from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AuthenticationError
from app.core.security import decode_access_token
from app.database import get_db

security = HTTPBearer(auto_error=False)


async def get_session(session: AsyncSession = Depends(get_db)):
    return session


async def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security)):
    """Optional auth — returns user payload or None for prototype."""
    if credentials is None:
        # Allow unauthenticated access in prototype mode
        return {"sub": "demo-user", "role": "pa-coordinator", "name": "Demo User"}
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise AuthenticationError()
    return payload
