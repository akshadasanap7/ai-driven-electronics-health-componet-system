from abc import ABC, abstractmethod
from typing import Dict, Any

class HardwareInterface(ABC):
    """Abstract hardware interface - implement for STM32 or Simulator."""

    @abstractmethod
    def connect(self) -> bool: ...

    @abstractmethod
    def disconnect(self) -> None: ...

    @abstractmethod
    def start_test(self, component_type: str, test_type: str, config: Dict) -> bool: ...

    @abstractmethod
    def read_measurements(self) -> Dict[str, Any]: ...

    @abstractmethod
    def stop_test(self) -> None: ...

    @abstractmethod
    def get_status(self) -> Dict[str, Any]: ...
