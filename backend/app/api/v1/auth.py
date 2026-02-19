from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_session
from app.core.exceptions import AuthenticationError
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse

router = APIRouter()


@router.post("/auth/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise AuthenticationError("Invalid email or password")

    token = create_access_token({"sub": user.id, "role": user.role, "name": user.name})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.post("/auth/demo-login", response_model=TokenResponse)
async def demo_login(db: AsyncSession = Depends(get_session)):
    """Quick login for prototype demo — no password needed."""
    result = await db.execute(select(User).where(User.role == "pa-coordinator").limit(1))
    user = result.scalar_one_or_none()
    if not user:
        # Create demo user on the fly
        user = User(
            email="demo@brightvista.health",
            name="Demo Coordinator",
            hashed_password=hash_password("demo"),
            role="pa-coordinator",
            specialty="General",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role, "name": user.name})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))
