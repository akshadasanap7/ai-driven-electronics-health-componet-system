from app.config import settings
from app.hardware.stm32 import HardwareInterface

_hardware_instance: HardwareInterface = None

def get_hardware() -> HardwareInterface:
    global _hardware_instance
    if _hardware_instance is None:
        if settings.HARDWARE_MODE == "hardware":
            from app.hardware.serial_manager import STM32Hardware
            _hardware_instance = STM32Hardware(port=settings.SERIAL_PORT)
        else:
            from app.hardware.simulator import SimulatorHardware
            _hardware_instance = SimulatorHardware()
        _hardware_instance.connect()
    return _hardware_instance
