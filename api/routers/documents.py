from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import Any, List, Optional
import uuid
from datetime import datetime

from models.schemas import DocumentCreate, Document, DocumentUpdate
from utils.auth import get_current_active_user
from utils.supabase import get_supabase_client

router = APIRouter()

@router.post("/upload", response_model=Document, status_code=status.HTTP_201_CREATED)
async def upload_document(
    vehicle_id: str = Form(...),
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    current_user = Depends(get_current_active_user)
) -> Any:
    """
    Upload a document for a vehicle
    """
    supabase = get_supabase_client()
    
    # Check if vehicle exists and belongs to the current user
    vehicle_response = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
    
    if not vehicle_response.data or len(vehicle_response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    vehicle = vehicle_response.data[0]
    
    # Check if the vehicle belongs to the current user
    if vehicle["user_id"] != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Validate document type
    valid_doc_types = ["insurance", "registration", "contract"]
    if doc_type not in valid_doc_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Document type must be one of: {', '.join(valid_doc_types)}"
        )
    
    # Check if a document of this type already exists for this vehicle
    existing_doc_response = supabase.table("documents").select("*").eq("vehicle_id", vehicle_id).eq("doc_type", doc_type).execute()
    
    if existing_doc_response.data and len(existing_doc_response.data) > 0:
        # Delete the existing document
        existing_doc = existing_doc_response.data[0]
        supabase.table("documents").delete().eq("id", existing_doc["id"]).execute()
    
    # Generate a unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{current_user['id']}/{vehicle_id}/{doc_type}_{uuid.uuid4()}.{file_extension}"
    
    # Upload file to Supabase Storage
    file_content = await file.read()
    storage_response = supabase.storage.from_("vehicle_documents").upload(
        unique_filename,
        file_content,
        {"content-type": file.content_type}
    )
    
    if hasattr(storage_response, 'error') and storage_response.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload document: {storage_response.error.message}"
        )
    
    # Get public URL for the uploaded file
    file_url = supabase.storage.from_("vehicle_documents").get_public_url(unique_filename)
    
    # Create document record in Supabase
    document_data = {
        "vehicle_id": vehicle_id,
        "doc_type": doc_type,
        "file_url": file_url,
        "status": "uploaded"
    }
    
    doc_response = supabase.table("documents").insert(document_data).execute()
    
    if not doc_response.data or len(doc_response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create document record"
        )
    
    return doc_response.data[0]

@router.get("/vehicle/{vehicle_id}", response_model=List[Document])
async def get_vehicle_documents(
    vehicle_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    """
    Get all documents for a vehicle
    """
    supabase = get_supabase_client()
    
    # Check if vehicle exists and belongs to the current user
    vehicle_response = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
    
    if not vehicle_response.data or len(vehicle_response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    vehicle = vehicle_response.data[0]
    
    # Check if the vehicle belongs to the current user
    if vehicle["user_id"] != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Get documents
    response = supabase.table("documents").select("*").eq("vehicle_id", vehicle_id).execute()
    
    return response.data

@router.get("/{document_id}", response_model=Document)
async def get_document(
    document_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific document
    """
    supabase = get_supabase_client()
    
    # Get document
    doc_response = supabase.table("documents").select("*").eq("id", document_id).execute()
    
    if not doc_response.data or len(doc_response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    document = doc_response.data[0]
    
    # Get vehicle to check ownership
    vehicle_response = supabase.table("vehicles").select("*").eq("id", document["vehicle_id"]).execute()
    
    if not vehicle_response.data or len(vehicle_response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    vehicle = vehicle_response.data[0]
    
    # Check if the vehicle belongs to the current user
    if vehicle["user_id"] != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return document

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    """
    Delete a document
    """
    supabase = get_supabase_client()
    
    # Get document
    doc_response = supabase.table("documents").select("*").eq("id", document_id).execute()
    
    if not doc_response.data or len(doc_response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    document = doc_response.data[0]
    
    # Get vehicle to check ownership
    vehicle_response = supabase.table("vehicles").select("*").eq("id", document["vehicle_id"]).execute()
    
    if not vehicle_response.data or len(vehicle_response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    vehicle = vehicle_response.data[0]
    
    # Check if the vehicle belongs to the current user
    if vehicle["user_id"] != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if the vehicle is in a state that allows document deletion
    if vehicle["status"] not in ["draft", "rejected"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Documents for vehicle in '{vehicle['status']}' status cannot be deleted"
        )
    
    # Delete document
    supabase.table("documents").delete().eq("id", document_id).execute()
    
    return None
