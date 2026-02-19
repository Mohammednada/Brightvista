import asyncio
from collections import defaultdict
from typing import Any, Callable, Coroutine

EventHandler = Callable[..., Coroutine[Any, Any, None]]

_handlers: dict[str, list[EventHandler]] = defaultdict(list)


def on(event: str, handler: EventHandler):
    _handlers[event].append(handler)


async def emit(event: str, **kwargs):
    for handler in _handlers.get(event, []):
        asyncio.create_task(handler(**kwargs))
