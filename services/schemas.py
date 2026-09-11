"""API schemas for the TrackFlow inventory endpoints."""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


Warehouse = Literal["LA", "ZGZ"]
Category = Literal["fashion", "electronics", "cosmetics"]
ExitType = Literal["dispatch", "loss"]


class SKUCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    sku: str
    client_name: str
    category: Category
    warehouse: Warehouse


class SKUResponse(SKUCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    current_stock: int


class StockEntryCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sku_id: int
    quantity: int = Field(gt=0)
    reference: str
    warehouse: Warehouse


class StockEntryResponse(StockEntryCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    user_uuid: UUID


class StockExitCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sku_id: int
    quantity: int = Field(gt=0)
    exit_type: ExitType
    tracking_number: str | None = None
    warehouse: Warehouse


class StockExitResponse(StockExitCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    user_uuid: UUID


class OrderResponse(BaseModel):
    """Unified representation of an inbound or outbound movement."""

    movement_type: Literal["inbound", "outbound"]
    id: int
    sku_id: int
    sku: str
    name: str
    client_name: str
    warehouse: Warehouse
    quantity: int
    created_at: datetime
    user_uuid: UUID
    reference: str | None = None
    exit_type: ExitType | None = None
    tracking_number: str | None = None