"""SQLModel database models for TrackFlow inventory."""

from datetime import UTC, datetime
from uuid import UUID
from sqlmodel import Field, SQLModel


class SKU(SQLModel, table=True):
    """Inventory SKU stored in a specific warehouse."""

    __tablename__ = "skus"

    id: int | None = Field(default=None, primary_key=True)
    name: str
    sku: str
    client_name: str
    category: str
    warehouse: str


class StockEntry(SQLModel, table=True):
    """Inbound stock movement for a SKU."""

    __tablename__ = "stock_entries"

    id: int | None = Field(default=None, primary_key=True)
    sku_id: int = Field(foreign_key="skus.id")
    quantity: int
    reference: str
    warehouse: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    user_uuid: UUID


class StockExit(SQLModel, table=True):
    """Outbound stock movement for a SKU."""

    __tablename__ = "stock_exits"

    id: int | None = Field(default=None, primary_key=True)
    sku_id: int = Field(foreign_key="skus.id")
    quantity: int
    exit_type: str
    tracking_number: str | None = None
    warehouse: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    user_uuid: UUID
