import json
from sqlalchemy.orm import Session
from app.models.entities import HostedZone, DNSRecord

DEFAULT_NS = [
    "ns-123.awsdns-15.com.",
    "ns-567.awsdns-07.net.",
    "ns-890.awsdns-32.org.",
    "ns-1456.awsdns-54.co.uk."
]

def seed_database(db: Session):
    # Check if database already has data
    if db.query(HostedZone).first():
        return

    # 1. Zone: production-app.io.
    zone1 = HostedZone(
        id="Z01122334455AA",
        name="production-app.io.",
        comment="Production public zone for SaaS platform",
        zone_type="PUBLIC"
    )
    db.add(zone1)

    r1_ns = DNSRecord(
        hosted_zone_id=zone1.id,
        name="production-app.io.",
        type="NS",
        ttl=172800,
        records_json=json.dumps(DEFAULT_NS),
        routing_policy="Simple"
    )
    r1_soa = DNSRecord(
        hosted_zone_id=zone1.id,
        name="production-app.io.",
        type="SOA",
        ttl=900,
        records_json=json.dumps([f"{DEFAULT_NS[0]} awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400"]),
        routing_policy="Simple"
    )
    r1_a = DNSRecord(
        hosted_zone_id=zone1.id,
        name="production-app.io.",
        type="A",
        ttl=300,
        records_json=json.dumps(["76.76.21.21", "76.76.21.22"]),
        routing_policy="Simple"
    )
    r1_cname = DNSRecord(
        hosted_zone_id=zone1.id,
        name="www.production-app.io.",
        type="CNAME",
        ttl=300,
        records_json=json.dumps(["production-app.io."]),
        routing_policy="Simple"
    )
    r1_txt = DNSRecord(
        hosted_zone_id=zone1.id,
        name="production-app.io.",
        type="TXT",
        ttl=300,
        records_json=json.dumps(['"v=spf1 include:_spf.google.com ~all"']),
        routing_policy="Simple"
    )
    r1_mx = DNSRecord(
        hosted_zone_id=zone1.id,
        name="production-app.io.",
        type="MX",
        ttl=300,
        records_json=json.dumps(["1 aspmx.l.google.com.", "5 alt1.aspmx.l.google.com."]),
        routing_policy="Simple"
    )
    db.add_all([r1_ns, r1_soa, r1_a, r1_cname, r1_txt, r1_mx])

    # 2. Zone: internal-corp.net. (Private Zone)
    zone2 = HostedZone(
        id="Z09988776655BB",
        name="internal-corp.net.",
        comment="Corporate internal intranet services",
        zone_type="PRIVATE"
    )
    db.add(zone2)

    r2_ns = DNSRecord(
        hosted_zone_id=zone2.id,
        name="internal-corp.net.",
        type="NS",
        ttl=172800,
        records_json=json.dumps(DEFAULT_NS),
        routing_policy="Simple"
    )
    r2_soa = DNSRecord(
        hosted_zone_id=zone2.id,
        name="internal-corp.net.",
        type="SOA",
        ttl=900,
        records_json=json.dumps([f"{DEFAULT_NS[0]} awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400"]),
        routing_policy="Simple"
    )
    r2_a = DNSRecord(
        hosted_zone_id=zone2.id,
        name="db.internal-corp.net.",
        type="A",
        ttl=60,
        records_json=json.dumps(["10.0.4.15"]),
        routing_policy="Simple"
    )
    db.add_all([r2_ns, r2_soa, r2_a])

    db.commit()