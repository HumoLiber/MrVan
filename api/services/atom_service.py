import httpx
from typing import Dict, Any, Optional
from config.settings import settings

async def create_atom_vehicle(
    brand: str,
    model: str,
    year: int,
    license_plate: str,
    partner_id: str
) -> Dict[str, Any]:
    """
    Create a vehicle in ATOM Mobility
    
    Args:
        brand: Vehicle brand
        model: Vehicle model
        year: Vehicle year
        license_plate: Vehicle license plate
        partner_id: Partner ID in the system
        
    Returns:
        Dict[str, Any]: Response from ATOM API
    """
    url = f"{settings.ATOM_API_URL}/vehicles"
    
    headers = {
        "Authorization": f"Bearer {settings.ATOM_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "brand": brand,
        "model": model,
        "year": year,
        "license_plate": license_plate,
        "partner_id": partner_id,
        "status": "available"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        
        if response.status_code == 201:
            return response.json()
        else:
            print(f"Error creating vehicle in ATOM: {response.text}")
            return None

async def update_atom_vehicle(
    atom_vehicle_id: str,
    data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Update a vehicle in ATOM Mobility
    
    Args:
        atom_vehicle_id: ATOM vehicle ID
        data: Data to update
        
    Returns:
        Dict[str, Any]: Response from ATOM API
    """
    url = f"{settings.ATOM_API_URL}/vehicles/{atom_vehicle_id}"
    
    headers = {
        "Authorization": f"Bearer {settings.ATOM_API_KEY}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.patch(url, json=data, headers=headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error updating vehicle in ATOM: {response.text}")
            return None

async def get_atom_vehicle(atom_vehicle_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a vehicle from ATOM Mobility
    
    Args:
        atom_vehicle_id: ATOM vehicle ID
        
    Returns:
        Optional[Dict[str, Any]]: Vehicle data or None if not found
    """
    url = f"{settings.ATOM_API_URL}/vehicles/{atom_vehicle_id}"
    
    headers = {
        "Authorization": f"Bearer {settings.ATOM_API_KEY}"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error getting vehicle from ATOM: {response.text}")
            return None
