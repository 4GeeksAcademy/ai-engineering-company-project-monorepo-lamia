"""Idempotent development seed data for TrackFlow inventory.

The UUID ``00000000-0000-0000-0000-000000000001`` is reserved for these
development movements and does not represent a PostgreSQL user record.
"""

from __future__ import annotations

from uuid import UUID

from sqlmodel import Session, select

from database import create_db_and_tables, engine
from models import SKU, StockEntry, StockExit


SEED_USER_UUID = UUID("00000000-0000-0000-0000-000000000001")

SKU_DATA = [
    ("Classic White Sneaker", "CLT-SNK-W-42", "Northwind", "fashion", "LA"),
    ("Black Headphones", "ELC-HDP-BLK", "Northwind", "electronics", "LA"),
    ("Serum 30ml", "COS-SRM-30", "Luma", "cosmetics", "LA"),
    ("Classic White Sneaker Z", "CLT-SNK-W-42-Z", "Northwind", "fashion", "ZGZ"),
    ("Black Headphones Z", "ELC-HDP-BLK-Z", "Iberia Retail", "electronics", "ZGZ"),
    ("Serum 30ml Z", "COS-SRM-30-Z", "Luma", "cosmetics", "ZGZ"),
]


def seed() -> None:
    create_db_and_tables()
    with Session(engine) as session:
        products: dict[str, SKU] = {}
        for name, sku, client_name, category, warehouse in SKU_DATA:
            product = session.exec(select(SKU).where(SKU.sku == sku)).first()
            if product is None:
                product = SKU(
                    name=name,
                    sku=sku,
                    client_name=client_name,
                    category=category,
                    warehouse=warehouse,
                )
                session.add(product)
                session.flush()
            products[sku] = product

        entries = [
            ("CLT-SNK-W-42", 40, "SEED-LA-SNK-1"),
            ("CLT-SNK-W-42", 20, "SEED-LA-SNK-2"),
            ("ELC-HDP-BLK", 25, "SEED-LA-HDP-1"),
            ("COS-SRM-30", 30, "SEED-LA-SRM-1"),
            ("CLT-SNK-W-42-Z", 35, "SEED-ZGZ-SNK-1"),
            ("ELC-HDP-BLK-Z", 18, "SEED-ZGZ-HDP-1"),
            ("COS-SRM-30-Z", 22, "SEED-ZGZ-SRM-1"),
        ]
        for sku, quantity, reference in entries:
            product = products[sku]
            exists = session.exec(
                select(StockEntry).where(StockEntry.reference == reference)
            ).first()
            if exists is None:
                session.add(
                    StockEntry(
                        sku_id=product.id,
                        quantity=quantity,
                        reference=reference,
                        warehouse=product.warehouse,
                        user_uuid=SEED_USER_UUID,
                    )
                )

        exits = [
            ("CLT-SNK-W-42", 8, "dispatch", "SEED-LA-TRACK-1"),
            ("ELC-HDP-BLK", 3, "loss", None),
            ("CLT-SNK-W-42-Z", 5, "dispatch", "SEED-ZGZ-TRACK-1"),
        ]
        for sku, quantity, exit_type, tracking_number in exits:
            product = products[sku]
            exists = session.exec(
                select(StockExit).where(
                    StockExit.sku_id == product.id,
                    StockExit.exit_type == exit_type,
                    StockExit.tracking_number == tracking_number,
                )
            ).first()
            if exists is None:
                session.add(
                    StockExit(
                        sku_id=product.id,
                        quantity=quantity,
                        exit_type=exit_type,
                        tracking_number=tracking_number,
                        warehouse=product.warehouse,
                        user_uuid=SEED_USER_UUID,
                    )
                )
        session.commit()
    print("Development inventory seed completed.")


if __name__ == "__main__":
    seed()