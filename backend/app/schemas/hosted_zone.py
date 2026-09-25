from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class HostedZoneCreate(BaseModel):
    name: str = Field(..., example="example.com")
    comment: Optional[str] = Field(default="", example="Production environment")
    zone_type: str = Field(default="PUBLIC", example="PUBLIC") # PUBLIC or PRIVATE

class HostedZoneUpdate(BaseModel):
    comment: Optional[str] = None

class HostedZoneOut(BaseModel):
    id: str
    name: str
    comment: Optional[str]
    zone_type: str
    record_count: int
    created_at: datetime

    class Config:
        from_attributes = True