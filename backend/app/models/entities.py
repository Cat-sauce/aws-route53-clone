import json
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class HostedZone(Base):
    __tablename__ = "hosted_zone"

    id = Column(String, primary_key=True, default=lambda: f"Z{uuid.uuid4().hex[:12].upper()}")
    name = Column(String, nullable=False, index=True)          # e.g., "example.com."
    comment = Column(String, default="")
    zone_type = Column(String, default="PUBLIC", nullable=False) # PUBLIC or PRIVATE
    caller_reference = Column(String, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Cascading delete: deleting a zone deletes all its records
    records = relationship("DNSRecord", back_populates="hosted_zone", cascade="all, delete-orphan")


class DNSRecord(Base):
    __tablename__ = "dns_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    hosted_zone_id = Column(String, ForeignKey("hosted_zone.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)          # e.g., "api.example.com."
    type = Column(String, nullable=False)                       # A, AAAA, CNAME, TXT, MX, NS, SOA, etc.
    ttl = Column(Integer, default=300, nullable=False)
    records_json = Column("records", String, nullable=False)   # Stored as JSON string e.g. '["1.2.3.4"]'
    routing_policy = Column(String, default="Simple", nullable=False)
    weight = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    hosted_zone = relationship("HostedZone", back_populates="records")

    # Helper property to get/set records cleanly as Python lists
    @property
    def records_list(self):
        try:
            return json.loads(self.records_json)
        except Exception:
            return []

    @records_list.setter
    def records_list(self, values: list[str]):
        self.records_json = json.dumps(values)