from fastapi import APIRouter
from app.services.hardware_service import get_hardware
from app.config import settings

router = APIRouter(prefix="/api/system", tags=["system"])

@router.get("/status")
def system_status():
    hw = get_hardware()
    hw_status = hw.get_status()
    return {
        "stm32": {"connected": hw_status.get("connected", False), "mode": hw_status.get("mode", "unknown")},
        "backend": {"online": True},
        "database": {"connected": True},
        "ai_engine": {"ready": True},
        "hardware_mode": settings.HARDWARE_MODE,
    }
