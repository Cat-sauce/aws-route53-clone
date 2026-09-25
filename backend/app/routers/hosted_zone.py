import json
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.entities import HostedZone, DNSRecord
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneOut, HostedZoneUpdate

router = APIRouter(prefix="/api/hosted-zone", tags=["Hosted Zone"])

DEFAULT_NS = [
    "ns-001.awsdns-01.com.",
    "ns-512.awsdns-02.net.",
    "ns-1024.awsdns-03.org.",
    "ns-1536.awsdns-04.co.uk."
]

@router.get("", response_model=List[HostedZoneOut])
def list_hosted_zone(
    search: Optional[str] = Query(None, description="Search by zone name"),
    db: Session = Depends(get_db)
):
    query = db.query(HostedZone)
    if search:
        query = query.filter(HostedZone.name.ilike(f"%{search}%"))
    
    zone = query.order_by(HostedZone.created_at.desc()).all()
    
    # Calculate live record count per zone
    results = []
    for zone in zone:
        count = db.query(DNSRecord).filter(DNSRecord.hosted_zone_id == zone.id).count()
        results.append(
            HostedZoneOut(
                id=zone.id,
                name=zone.name,
                comment=zone.comment,
                zone_type=zone.zone_type,
                record_count=count,
                created_at=zone.created_at
            )
        )
    return results

@router.post("", response_model=HostedZoneOut, status_code=201)
def create_hosted_zone(payload: HostedZoneCreate, db: Session = Depends(get_db)):
    clean_name = payload.name.strip().lower()
    if not clean_name.endswith("."):
        clean_name += "."

    # Check if zone name already exists
    existing = db.query(HostedZone).filter(HostedZone.name == clean_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="A hosted zone with this domain name already exists.")

    zone_id = f"Z{uuid.uuid4().hex[:12].upper()}"
    new_zone = HostedZone(
        id=zone_id,
        name=clean_name,
        comment=payload.comment or "",
        zone_type=payload.zone_type.upper()
    )
    db.add(new_zone)
    db.flush()

    # Automatically generate default NS Record set like real AWS Route 53
    ns_record = DNSRecord(
        hosted_zone_id=new_zone.id,
        name=clean_name,
        type="NS",
        ttl=172800,
        records_json=json.dumps(DEFAULT_NS),
        routing_policy="Simple"
    )
    db.add(ns_record)

    # Automatically generate default SOA Record set
    soa_val = f"{DEFAULT_NS[0]} awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400"
    soa_record = DNSRecord(
        hosted_zone_id=new_zone.id,
        name=clean_name,
        type="SOA",
        ttl=900,
        records_json=json.dumps([soa_val]),
        routing_policy="Simple"
    )
    db.add(soa_record)

    db.commit()
    db.refresh(new_zone)

    return HostedZoneOut(
        id=new_zone.id,
        name=new_zone.name,
        comment=new_zone.comment,
        zone_type=new_zone.zone_type,
        record_count=2,
        created_at=new_zone.created_at
    )

@router.get("/{zone_id}", response_model=HostedZoneOut)
def get_hosted_zone(zone_id: str, db: Session = Depends(get_db)):
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found.")

    count = db.query(DNSRecord).filter(DNSRecord.hosted_zone_id == zone.id).count()
    return HostedZoneOut(
        id=zone.id,
        name=zone.name,
        comment=zone.comment,
        zone_type=zone.zone_type,
        record_count=count,
        created_at=zone.created_at
    )

@router.put("/{zone_id}", response_model=HostedZoneOut)
def update_hosted_zone(zone_id: str, payload: HostedZoneUpdate, db: Session = Depends(get_db)):
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found.")

    if payload.comment is not None:
        zone.comment = payload.comment

    db.commit()
    db.refresh(zone)
    count = db.query(DNSRecord).filter(DNSRecord.hosted_zone_id == zone.id).count()
    return HostedZoneOut(
        id=zone.id,
        name=zone.name,
        comment=zone.comment,
        zone_type=zone.zone_type,
        record_count=count,
        created_at=zone.created_at
    )

@router.delete("/{zone_id}", status_code=204)
def delete_hosted_zone(zone_id: str, db: Session = Depends(get_db)):
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found.")

    db.delete(zone)
    db.commit()
    return None