# TrackFlow backend

TinyDB stores authentication users. Supabase/PostgreSQL stores inventory data.

## Run

From this directory, configure `DATABASE_URL` and `JWT_SECRET` in `.env`, then run:

```bash
uv run fastapi dev main.py
```

Create development inventory data with:

```bash
uv run python seed.py
```

The seed uses a documented development UUID and is idempotent. It is not run automatically by the API.

## API

Inventory endpoints:

- `GET /inventory/products`
- `POST /inventory/products`
- `GET /inventory/products/{id}`
- `POST /inventory/orders/inbound`
- `POST /inventory/orders/outbound`
- `GET /inventory/orders`

Authentication remains under `/auth` and users remain in TinyDB.

`current_stock` is computed from inbound minus outbound quantities for the individual SKU and its warehouse; it is never stored as a column.

Required environment variables use placeholders in `.env.example`: `DATABASE_URL` and `JWT_SECRET`.

- **Main purpose**: provide the TrackFlow authentication and inventory API.

> Spanish version: [README.es.md](./README.es.md).
