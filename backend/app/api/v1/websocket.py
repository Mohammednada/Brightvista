import asyncio
import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()
logger = logging.getLogger("brightvista.ws")

# Simple in-memory connection manager
_connections: dict[str, list[WebSocket]] = {}


class ConnectionManager:
    async def connect(self, ws: WebSocket, case_id: str):
        await ws.accept()
        _connections.setdefault(case_id, []).append(ws)
        logger.info(f"WebSocket connected for case {case_id}")

    def disconnect(self, ws: WebSocket, case_id: str):
        if case_id in _connections:
            _connections[case_id] = [c for c in _connections[case_id] if c != ws]
            logger.info(f"WebSocket disconnected for case {case_id}")

    async def broadcast(self, case_id: str, message: dict):
        for ws in _connections.get(case_id, []):
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                pass

    async def broadcast_all(self, message: dict):
        for conns in _connections.values():
            for ws in conns:
                try:
                    await ws.send_text(json.dumps(message))
                except Exception:
                    pass


manager = ConnectionManager()


@router.websocket("/ws/cases/{case_id}")
async def case_websocket(ws: WebSocket, case_id: str):
    await manager.connect(ws, case_id)
    try:
        while True:
            data = await ws.receive_text()
            msg = json.loads(data)

            # Echo back with acknowledgment
            await ws.send_text(json.dumps({"type": "ack", "received": msg}))

            # Handle ping/pong
            if msg.get("type") == "ping":
                await ws.send_text(json.dumps({"type": "pong"}))
    except WebSocketDisconnect:
        manager.disconnect(ws, case_id)


@router.websocket("/ws/dashboard")
async def dashboard_websocket(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = await ws.receive_text()
            msg = json.loads(data)
            if msg.get("type") == "ping":
                await ws.send_text(json.dumps({"type": "pong"}))
    except WebSocketDisconnect:
        pass
