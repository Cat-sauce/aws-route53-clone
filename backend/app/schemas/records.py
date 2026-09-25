from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
import re

class DNSRecordCreate(BaseModel):
    name: str = Field(..., example="api.example.com.")
    type: str = Field(..., example="A")
    ttl: int = Field(default=300, ge=0, le=2147483647)
    records: List[str] = Field(..., min_items=1)
    routing_policy: Optional[str] = Field(default="Simple")
    weight: Optional[int] = Field(default=None, ge=0, le=255)
    health_check_id: Optional[str] = None

    @field_validator("name")
    def validate_dns_name(cls, v):
        v = v.strip().lower()
        if not v.endswith("."):
            v += "."
        return v

class DNSRecordUpdate(BaseModel):
    ttl: Optional[int] = Field(default=None, ge=0)
    records: Optional[List[str]] = None
    routing_policy: Optional[str] = None
    weight: Optional[int] = None

class DNSRecordOut(BaseModel):
    id: str
    hosted_zone_id: str
    name: str
    type: str
    ttl: int
    records: List[str]
    routing_policy: str
    weight: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True