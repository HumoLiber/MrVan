import { SupabaseClient } from './supabaseClient';

export interface Vehicle {
  id?: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  delegation_mode: 'service_only' | 'partial' | 'full_delegation';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  user_id: string;
}

export interface Document {
  id?: string;
  vehicle_id: string;
  doc_type: 'insurance' | 'registration' | 'contract';
  file_url: string;
  status: 'uploaded' | 'signed' | 'rejected';
}

export interface VehicleResponse {
  data: Vehicle | null;
  error: Error | null;
}

export interface VehiclesResponse {
  data: Vehicle[] | null;
  error: Error | null;
}

export interface DocumentResponse {
  data: Document | null;
  error: Error | null;
}

export class VehicleService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Get all vehicles for the current user
   */
  async getUserVehicles(userId: string): Promise<VehiclesResponse> {
    try {
      const { data, error } = await this.supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return {
        data: data as Vehicle[],
        error: null
      };
    } catch (error) {
      console.error('Vehicle service error:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error fetching vehicles')
      };
    }
  }
  
  /**
   * Get a specific vehicle by ID
   */
  async getVehicleById(vehicleId: string): Promise<VehicleResponse> {
    try {
      const { data, error } = await this.supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();
      
      if (error) throw error;
      
      return {
        data: data as Vehicle,
        error: null
      };
    } catch (error) {
      console.error('Vehicle service error:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error fetching vehicle')
      };
    }
  }
  
  /**
   * Create a new vehicle
   */
  async createVehicle(vehicleData: Omit<Vehicle, 'id'>): Promise<VehicleResponse> {
    try {
      const { data, error } = await this.supabase
        .from('vehicles')
        .insert([vehicleData])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        data: data as Vehicle,
        error: null
      };
    } catch (error) {
      console.error('Vehicle service error:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error creating vehicle')
      };
    }
  }
  
  /**
   * Update an existing vehicle
   */
  async updateVehicle(vehicleId: string, vehicleData: Partial<Vehicle>): Promise<VehicleResponse> {
    try {
      const { data, error } = await this.supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', vehicleId)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        data: data as Vehicle,
        error: null
      };
    } catch (error) {
      console.error('Vehicle service error:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error updating vehicle')
      };
    }
  }
  
  /**
   * Upload a document for a vehicle
   */
  async uploadDocument(
    userId: string,
    vehicleId: string,
    file: File,
    docType: Document['doc_type']
  ): Promise<DocumentResponse> {
    try {
      // 1. Upload file to storage
      const fileName = `${userId}/${vehicleId}/${docType}_${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error: uploadError } = await this.supabase.storage
        .from('vehicle_documents')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      // 2. Get public URL
      const { data: publicUrlData } = this.supabase.storage
        .from('vehicle_documents')
        .getPublicUrl(fileName);
        
      // 3. Create document record
      const { data, error } = await this.supabase
        .from('documents')
        .insert([
          {
            vehicle_id: vehicleId,
            doc_type: docType,
            file_url: publicUrlData.publicUrl,
            status: 'uploaded'
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        data: data as Document,
        error: null
      };
    } catch (error) {
      console.error('Vehicle service error:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error uploading document')
      };
    }
  }
  
  /**
   * Get documents for a vehicle
   */
  async getVehicleDocuments(vehicleId: string): Promise<{ data: Document[] | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .eq('vehicle_id', vehicleId);
      
      if (error) throw error;
      
      return {
        data: data as Document[],
        error: null
      };
    } catch (error) {
      console.error('Vehicle service error:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error fetching documents')
      };
    }
  }
}
