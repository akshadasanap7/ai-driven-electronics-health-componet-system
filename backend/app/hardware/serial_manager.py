import serial
import json
from typing import Dict, Any
from app.hardware.stm32 import HardwareInterface

class STM32Hardware(HardwareInterface):
    """Real STM32 hardware via UART/USB serial."""

    def __init__(self, port: str, baud: int = 115200):
        self.port = port
        self.baud = baud
        self._serial = None
        self._connected = False

    def connect(self) -> bool:
        try:
            self._serial = serial.Serial(self.port, self.baud, timeout=2)
            self._connected = True
            return True
        except Exception as e:
            self._connected = False
            return False

    def disconnect(self) -> None:
        if self._serial and self._serial.is_open:
            self._serial.close()
        self._connected = False

    def start_test(self, component_type: str, test_type: str, config: Dict) -> bool:
        if not self._connected:
            return False
        cmd = json.dumps({"cmd": "start", "component": component_type, "test": test_type, **config})
        self._serial.write((cmd + "\n").encode())
        return True

    def read_measurements(self) -> Dict[str, Any]:
        if not self._connected:
            return {}
        line = self._serial.readline().decode().strip()
        return json.loads(line) if line else {}

    def stop_test(self) -> None:
        if self._connected:
            self._serial.write(b'{"cmd":"stop"}\n')

    def get_status(self) -> Dict[str, Any]:
        return {"connected": self._connected, "port": self.port, "mode": "hardware"}
