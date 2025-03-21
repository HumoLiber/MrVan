from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import Any, List, Optional
import json
import uuid
from datetime import datetime

from models.schemas import VehicleCreate, Vehicle, VehicleUpdate
from utils.auth import get_current_active_user
from utils.supabase import get_supabase_client

router = APIRouter()

@router.post("/", response_model=Vehicle, status_code=status.HTTP_201_CREATED)
async def create_vehicle(
    vehicle_data: VehicleCreate,
    current_user = Depends(get_current_active_user)
) -> Any:
    """
    Create a new vehicle
    """
    supabase = get_supabase_client()
    
    # Create vehicle in Supabase
    vehicle_dict = vehicle_data.dict()
    vehicle_dict["user_id"] = current_user["id"]
    vehicle_dict["status"] = "draft"
    
    response = supabase.table("vehicles").insert(vehicle_dict).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create vehicle"
        )
    
    return response.data[0]

@router.get("/", response_model=List[Vehicle])
async def get_vehicles(
    current_user = Depends(get_current_active_user)
) -> Any:
    """
    Get all vehicles for the current user
    """
    supabase = get_supabase_client()
    
    response = supabase.table("vehicles").select("*").eq("user_id", current_user["id"]).execute()
    
    return response.data

@router.get("/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(
    vehicle_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific vehicle
    """
    supabase = get_supabase_client()
    
    response = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    vehicle = response.data[0]
    
    # Check if the vehicle belongs to the current user
    if vehicle["user_id"] != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return vehicle

@router.patch("/{vehicle_id}", response_model=Vehicle)
async def update_vehicle(
    vehicle_id: str,
    vehicle_data: VehicleUpdate,
    current_user = Depends(get_current_active_user)
) -> Any:
    """
    Update a vehicle
    """
    supabase = get_supabase_client()
    
    # Check if vehicle exists and belongs to the current user
    response = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    vehicle = response.data[0]
    
    # Check if the vehicle belongs to the current user
    if vehicle["user_id"] != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if the vehicle is in a state that allows updates
    if vehicle["status"] not in ["draft", "rejected"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vehicle in '{vehicle['status']}' status cannot be updated"
        )
    
    # Update vehicle
    update_dict = {k: v for k, v in vehicle_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow().isoformat()
    
    response = supabase.table("vehicles").update(update_dict).eq("id", vehicle_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update vehicle"
        )
    
    return response.data[0]

@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vehicle(
    vehicle_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    """
    Delete a vehicle
    """
    supabase = get_supabase_client()
    
    # Check if vehicle exists and belongs to the current user
    response = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    vehicle = response.data[0]
    
    # Check if the vehicle belongs to the current user
    if vehicle["user_id"] != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if the vehicle is in a state that allows deletion
    if vehicle["status"] not in ["draft", "rejected"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vehicle in '{vehicle['status']}' status cannot be deleted"
        )
    
    # Delete related documents
    supabase.table("documents").delete().eq("vehicle_id", vehicle_id).execute()
    
    # Delete vehicle
    supabase.table("vehicles").delete().eq("id", vehicle_id).execute()
    
    return None

@router.post("/{vehicle_id}/submit", response_model=Vehicle)
async def submit_vehicle(
    vehicle_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    """
    Submit a vehicle for review
    """
    supabase = get_supabase_client()
    
    # Check if vehicle exists and belongs to the current user
    response = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    vehicle = response.data[0]
    
    # Check if the vehicle belongs to the current user
    if vehicle["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if the vehicle is in a state that allows submission
    if vehicle["status"] not in ["draft", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vehicle in '{vehicle['status']}' status cannot be submitted"
        )
    
    # Check if required documents are uploaded
    documents_response = supabase.table("documents").select("*").eq("vehicle_id", vehicle_id).execute()
    
    if not documents_response.data or len(documents_response.data) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle must have at least insurance and registration documents"
        )
    
    # Update vehicle status
    update_dict = {
        "status": "pending",
        "updated_at": datetime.utcnow().isoformat()
    }
    
    response = supabase.table("vehicles").update(update_dict).eq("id", vehicle_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit vehicle"
        )
    
    return response.data[0]
