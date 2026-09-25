import json
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.entities import HostedZone, DNSRecord
from app.schemas.records import DNSRecordCreate, DNSRecordOut, DNSRecordUpdate

router = APIRouter(prefix="/api/hosted-zone/{zone_id}/records", tags=["DNS Records"])

SUPPORTED_TYPES = {"A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA", "SOA"}

@router.get("", response_model=List[DNSRecordOut])
def list_records(
    zone_id: str,
    search: Optional[str] = Query(None, description="Search by record name"),
    record_type: Optional[str] = Query(None, description="Filter by type (A, CNAME, etc.)"),
    db: Session = Depends(get_db)
):
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found.")

    query = db.query(DNSRecord).filter(DNSRecord.hosted_zone_id == zone_id)

    if search:
        query = query.filter(DNSRecord.name.ilike(f"%{search}%"))
    if record_type:
        query = query.filter(DNSRecord.type == record_type.upper())

    records = query.order_by(DNSRecord.name.asc(), DNSRecord.type.asc()).all()

    return [
        DNSRecordOut(
            id=r.id,
            hosted_zone_id=r.hosted_zone_id,
            name=r.name,
            type=r.type,
            ttl=r.ttl,
            records=r.records_list,
            routing_policy=r.routing_policy,
            weight=getattr(r, "weight", None),
            created_at=r.created_at
        )
        for r in records
    ]

@router.post("", response_model=DNSRecordOut, status_code=201)
def create_record(zone_id: str, payload: DNSRecordCreate, db: Session = Depends(get_db)):
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found.")

    record_type = payload.type.upper()
    if record_type not in SUPPORTED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported record type: {record_type}")

    clean_name = payload.name.strip().lower()
    if not clean_name.endswith("."):
        clean_name += "."

    existing = db.query(DNSRecord).filter(
        DNSRecord.hosted_zone_id == zone_id,
        DNSRecord.name == clean_name,
        DNSRecord.type == record_type
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"A record set with name '{clean_name}' and type '{record_type}' already exists in this zone."
        )

    new_record = DNSRecord(
        id=str(uuid.uuid4()),
        hosted_zone_id=zone_id,
        name=clean_name,
        type=record_type,
        ttl=payload.ttl,
        records_json=json.dumps(payload.records),
        routing_policy=payload.routing_policy or "Simple",
        weight=payload.weight
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return DNSRecordOut(
        id=new_record.id,
        hosted_zone_id=new_record.hosted_zone_id,
        name=new_record.name,
        type=new_record.type,
        ttl=new_record.ttl,
        records=new_record.records_list,
        routing_policy=new_record.routing_policy,
        weight=getattr(new_record, "weight", None),
        created_at=new_record.created_at
    )

@router.put("/{record_id}", response_model=DNSRecordOut)
def update_record(zone_id: str, record_id: str, payload: DNSRecordUpdate, db: Session = Depends(get_db)):
    record = db.query(DNSRecord).filter(
        DNSRecord.id == record_id,
        DNSRecord.hosted_zone_id == zone_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="DNS record not found.")

    if payload.ttl is not None:
        record.ttl = payload.ttl
    if payload.records is not None:
        record.records_json = json.dumps(payload.records)
    if payload.routing_policy is not None:
        record.routing_policy = payload.routing_policy
    if payload.weight is not None:
        record.weight = payload.weight

    db.commit()
    db.refresh(record)

    return DNSRecordOut(
        id=record.id,
        hosted_zone_id=record.hosted_zone_id,
        name=record.name,
        type=record.type,
        ttl=record.ttl,
        records=record.records_list,
        routing_policy=record.routing_policy,
        weight=getattr(record, "weight", None),
        created_at=record.created_at
    )

@router.delete("/{record_id}", status_code=204)
def delete_record(zone_id: str, record_id: str, db: Session = Depends(get_db)):
    record = db.query(DNSRecord).filter(
        DNSRecord.id == record_id,
        DNSRecord.hosted_zone_id == zone_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="DNS record not found.")

    if record.type in {"SOA"}:
        raise HTTPException(status_code=400, detail="Cannot delete default SOA record from hosted zone.")

    db.delete(record)
    db.commit()
    return None