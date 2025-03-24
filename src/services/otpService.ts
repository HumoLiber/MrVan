import { supabaseClient } from './supabaseClient';

export interface OtpResponse {
  success: boolean;
  error: Error | null;
  message?: string;
}

export const OtpService = {
  /**
   * Send OTP code to user's phone
   * Note: This is a mock implementation. In a real app, this would call a backend API
   * that integrates with Twilio or another SMS provider
   */
  sendOtp: async (phoneNumber: string, userId: string): Promise<OtpResponse> => {
    try {
      // In a real implementation, this would call your backend API
      // which would then use Twilio to send the OTP
      
      // For now, we'll just simulate this by updating the user's record
      // to indicate that an OTP has been sent
      const { error } = await supabaseClient
        .from('user_profiles')
        .upsert({
          user_id: userId,
          phone: phoneNumber,
          phone_verification_status: 'pending',
          phone_verification_sent_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      return {
        success: true,
        error: null,
        message: 'OTP code sent successfully'
      };
    } catch (error) {
      console.error('OTP service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error sending OTP'),
        message: 'Failed to send OTP code'
      };
    }
  },
  
  /**
   * Verify OTP code entered by user
   * Note: This is a mock implementation. In a real app, this would call a backend API
   * that verifies the code with Twilio or another SMS provider
   */
  verifyOtp: async (phoneNumber: string, otpCode: string, userId: string): Promise<OtpResponse> => {
    try {
      // In a real implementation, this would verify the OTP with Twilio
      // For demo purposes, we'll accept any 6-digit code
      if (!/^\d{6}$/.test(otpCode)) {
        return {
          success: false,
          error: new Error('Invalid OTP format'),
          message: 'OTP must be a 6-digit number'
        };
      }
      
      // Update the user's record to indicate that the phone is verified
      const { error } = await supabaseClient
        .from('user_profiles')
        .update({
          phone_verification_status: 'verified',
          phone_verified_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return {
        success: true,
        error: null,
        message: 'Phone verified successfully'
      };
    } catch (error) {
      console.error('OTP service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error verifying OTP'),
        message: 'Failed to verify OTP code'
      };
    }
  }
};
