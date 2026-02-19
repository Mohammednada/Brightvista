import pytest


@pytest.mark.asyncio
async def test_root(client):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "Brightvista" in data["service"]


@pytest.mark.asyncio
async def test_health(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_create_case(client):
    response = await client.post("/api/v1/cases", json={"priority": "high", "department": "Orthopedics"})
    assert response.status_code == 200
    data = response.json()["data"]
    assert "case_id" in data
    assert data["case_number"].startswith("PA-")
    assert data["status"] == "draft"


@pytest.mark.asyncio
async def test_list_cases(client):
    # Create a case first
    await client.post("/api/v1/cases", json={})
    response = await client.get("/api/v1/cases")
    assert response.status_code == 200
    assert isinstance(response.json()["data"], list)


@pytest.mark.asyncio
async def test_case_lifecycle(client):
    # Create case
    create_resp = await client.post("/api/v1/cases", json={"priority": "urgent"})
    case_id = create_resp.json()["data"]["case_id"]

    # Set patient
    patient_resp = await client.post(f"/api/v1/cases/{case_id}/patient", json={
        "name": "Test Patient",
        "dob": "01/01/1980",
        "mrn": "MRN-12345",
        "insurance_payer": "Test Payer",
        "member_id": "MEM-99999",
        "plan_type": "PPO",
        "referring_physician": "Dr. Test",
    })
    assert patient_resp.status_code == 200
    case_data = patient_resp.json()["data"]
    assert case_data["patient"]["name"] == "Test Patient"
    assert case_data["approval_likelihood"] >= 20  # Patient completeness should score

    # Set procedure
    proc_resp = await client.post(f"/api/v1/cases/{case_id}/procedure", json={
        "cpt_code": "72141",
        "cpt_description": "MRI Cervical Spine",
        "icd10_code": "M54.12",
        "icd10_description": "Cervical radiculopathy",
        "cpt_valid": True,
        "icd10_valid": True,
    })
    assert proc_resp.status_code == 200

    # Get case
    get_resp = await client.get(f"/api/v1/cases/{case_id}")
    assert get_resp.status_code == 200
    detail = get_resp.json()["data"]
    assert detail["case_number"].startswith("PA-")
    assert detail["procedure"]["cpt_code"] == "72141"


@pytest.mark.asyncio
async def test_validate_cpt(client):
    response = await client.post("/api/v1/ai/validate-cpt", json={"code": "72141"})
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["valid"] is True
    assert "MRI" in data["description"]


@pytest.mark.asyncio
async def test_validate_icd10(client):
    response = await client.post("/api/v1/ai/validate-icd10", json={"code": "M54.12"})
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["valid"] is True


@pytest.mark.asyncio
async def test_analytics_dashboard(client):
    response = await client.get("/api/v1/analytics/dashboard")
    assert response.status_code == 200
    data = response.json()["data"]
    assert "kpis" in data
    assert len(data["kpis"]) == 6


@pytest.mark.asyncio
async def test_analytics_coordinator(client):
    response = await client.get("/api/v1/analytics/coordinator")
    assert response.status_code == 200
    data = response.json()["data"]
    assert "kpis" in data
    assert "case_queue" in data


@pytest.mark.asyncio
async def test_ai_chat(client):
    response = await client.post("/api/v1/ai/chat", json={"message": "What are the PA requirements?"})
    assert response.status_code == 200
    data = response.json()["data"]
    assert "response" in data
