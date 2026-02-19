from pydantic import BaseModel
from typing import Any


class APIResponse(BaseModel):
    data: Any
    meta: dict | None = None
    errors: list[dict] | None = None


class PaginationMeta(BaseModel):
    total: int
    page: int
    per_page: int
    pages: int
