from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, List, Dict
from datetime import datetime

from models.schemas import Vehicle, User, AdminVehicleApproval
from utils.auth import get_current_admin_user
from utils.supabase import get_supabase_client
from services.email_service import send_vehicle_status_update_email
from services.atom_service import create_atom_vehicle

router = APIRouter()

@router.get("/users", response_model=List[User])
async def get_all_users(
    current_admin = Depends(get_current_admin_user)
) -> Any:
    """
    Get all users (admin only)
    """
    supabase = get_supabase_client()
    
    response = supabase.table("users").select("*").execute()
    
    return response.data

@router.get("/vehicles", response_model=List[Vehicle])
async def get_all_vehicles(
    current_admin = Depends(get_current_admin_user),
    status: str = None
) -> Any:
    """
    Get all vehicles (admin only)
    """
    supabase = get_supabase_client()
    
    query = supabase.table("vehicles").select("*")
    
    if status:
        query = query.eq("status", status)
    
    response = query.execute()
    
    return response.data

@router.post("/vehicles/{vehicle_id}/approve", response_model=Vehicle)
async def approve_vehicle(
    vehicle_id: str,
    approval_data: AdminVehicleApproval,
    current_admin = Depends(get_current_admin_user)
) -> Any:
    """
    Approve or reject a vehicle (admin only)
    """
    supabase = get_supabase_client()
    
    # Check if vehicle exists
    vehicle_response = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
    
    if not vehicle_response.data or len(vehicle_response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    vehicle = vehicle_response.data[0]
    
    # Check if the vehicle is in a state that allows approval/rejection
    if vehicle["status"] != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vehicle in '{vehicle['status']}' status cannot be approved/rejected"
        )
    
    # Update vehicle status
    update_dict = {
        "status": approval_data.status,
        "updated_at": datetime.utcnow().isoformat()
    }
    
    # If approved, create vehicle in ATOM Mobility
    if approval_data.status == "approved" and not vehicle.get("atom_vehicle_id"):
        # Get user info for ATOM integration
        user_response = supabase.table("users").select("*").eq("id", vehicle["user_id"]).execute()
        
        if not user_response.data or len(user_response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle owner not found"
            )
        
        user = user_response.data[0]
        
        # Create vehicle in ATOM
        atom_response = await create_atom_vehicle(
            brand=vehicle["brand"],
            model=vehicle["model"],
            year=vehicle["year"],
            license_plate=vehicle["license_plate"],
            partner_id=user["id"]
        )
        
        if atom_response:
            update_dict["atom_vehicle_id"] = atom_response.get("id")
        else:
            # If ATOM integration fails, still approve but without ATOM ID
            print(f"Warning: Failed to create vehicle in ATOM Mobility")
    
    # If rejected, store rejection reason
    if approval_data.status == "rejected" and approval_data.rejection_reason:
        update_dict["rejection_reason"] = approval_data.rejection_reason
    
    # Update vehicle
    response = supabase.table("vehicles").update(update_dict).eq("id", vehicle_id).execute()
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update vehicle status"
        )
    
    updated_vehicle = response.data[0]
    
    # Send email notification to the vehicle owner
    user_response = supabase.table("users").select("*").eq("id", vehicle["user_id"]).execute()
    
    if user_response.data and len(user_response.data) > 0:
        user = user_response.data[0]
        
        await send_vehicle_status_update_email(
            email_to=user["email"],
            vehicle_brand=vehicle["brand"],
            vehicle_model=vehicle["model"],
            license_plate=vehicle["license_plate"],
            status=approval_data.status,
            rejection_reason=approval_data.rejection_reason if approval_data.status == "rejected" else None
        )
    
    return updated_vehicle

@router.get("/dashboard", response_model=Dict)
async def admin_dashboard(
    current_admin = Depends(get_current_admin_user)
) -> Any:
    """
    Get admin dashboard statistics
    """
    supabase = get_supabase_client()
    
    # Get total users count
    users_response = supabase.table("users").select("count", count="exact").execute()
    total_users = users_response.count if hasattr(users_response, 'count') else 0
    
    # Get total vehicles count
    vehicles_response = supabase.table("vehicles").select("count", count="exact").execute()
    total_vehicles = vehicles_response.count if hasattr(vehicles_response, 'count') else 0
    
    # Get vehicles by status
    pending_vehicles = supabase.table("vehicles").select("count", count="exact").eq("status", "pending").execute()
    pending_count = pending_vehicles.count if hasattr(pending_vehicles, 'count') else 0
    
    approved_vehicles = supabase.table("vehicles").select("count", count="exact").eq("status", "approved").execute()
    approved_count = approved_vehicles.count if hasattr(approved_vehicles, 'count') else 0
    
    rejected_vehicles = supabase.table("vehicles").select("count", count="exact").eq("status", "rejected").execute()
    rejected_count = rejected_vehicles.count if hasattr(rejected_vehicles, 'count') else 0
    
    draft_vehicles = supabase.table("vehicles").select("count", count="exact").eq("status", "draft").execute()
    draft_count = draft_vehicles.count if hasattr(draft_vehicles, 'count') else 0
    
    # Get recent vehicles
    recent_vehicles_response = supabase.table("vehicles").select("*").order("created_at", desc=True).limit(5).execute()
    recent_vehicles = recent_vehicles_response.data if hasattr(recent_vehicles_response, 'data') else []
    
    # Get recent users
    recent_users_response = supabase.table("users").select("*").order("created_at", desc=True).limit(5).execute()
    recent_users = recent_users_response.data if hasattr(recent_users_response, 'data') else []
    
    return {
        "total_users": total_users,
        "total_vehicles": total_vehicles,
        "vehicles_by_status": {
            "pending": pending_count,
            "approved": approved_count,
            "rejected": rejected_count,
            "draft": draft_count
        },
        "recent_vehicles": recent_vehicles,
        "recent_users": recent_users
    }
