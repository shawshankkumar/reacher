import axios from 'axios';

// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.com';

// Session Management
export const createSession = async (): Promise<{ session_id: string; points: number }> => {
  try {
    // Check if session ID already exists in localStorage
    const existingSessionId = localStorage.getItem('session_id');
    
    if (existingSessionId) {
      try {
        // Verify if the existing session is valid
        const sessionInfo = await getSessionInfo();
        if (sessionInfo && sessionInfo.is_active) {
          return {
            session_id: sessionInfo.session_id,
            points: sessionInfo.points
          };
        }
      } catch (sessionError) {
        // Session is invalid or expired, continue to create a new one
        console.log('Existing session invalid, creating new session');
      }
    }
    
    // Create a new session
    const response = await axios.post(`${API_BASE_URL}/api/v1/session`);
    const { data } = response.data;
    
    // Store session ID in localStorage
    localStorage.setItem('session_id', data.session_id);
    
    return data;
  } catch (error) {
    // Simplified error handling to avoid cloning issues
    console.error('Error creating session');
    throw new Error('Failed to create session');
  }
};

export const getSessionInfo = async (): Promise<{ 
  session_id: string; 
  points: number;
  username: string | null;
  image_link: string | null;
  is_active: boolean;
}> => {
  try {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      throw new Error('No session ID found');
    }
    
    const response = await axios.get(`${API_BASE_URL}/api/v1/session`, {
      headers: {
        'session-id': sessionId
      }
    });
    
    return response.data.data;
  } catch (error) {
    // Simplified error handling
    console.error('Error getting session info');
    throw new Error('Failed to get session info');
  }
};

// Question Management
export interface CityQuestion {
  clue: string;
  city_id: string;
  options: {
    city: string;
    country: string;
  }[];
}

export const getQuestion = async (): Promise<CityQuestion> => {
  try {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      throw new Error('No session ID found');
    }
    
    const response = await axios.get(`${API_BASE_URL}/api/v1/city/random`, {
      headers: {
        'session-id': sessionId
      }
    });
    
    return response.data.data;
  } catch (error) {
    // Simplified error handling
    console.error('Error getting question');
    throw new Error('Failed to get question');
  }
};

export interface GuessResponse {
  correct: boolean;
  points_gained?: number;
  points_lost?: number;
  total_points: number;
  city: {
    city: string;
    country: string;
  };
  fun_fact: string;
  trivia: string;
}

export const verifyGuess = async (cityId: string, guessCity: string): Promise<GuessResponse> => {
  try {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      throw new Error('No session ID found');
    }
    
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/city/guess/verify`,
      {
        city_id: cityId,
        guess_city: guessCity
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'session-id': sessionId
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    // Simplified error handling
    console.error('Error verifying guess');
    throw new Error('Failed to verify guess');
  }
};

// Invite Management
export interface InviteResponse {
  username: string;
  points: number;
  image_link: string;
  invite_id: string;
  invite_link: string;
  wa_image_url: string;
  wa_text: string;
}

export const createInvite = async (username: string): Promise<InviteResponse> => {
  try {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      throw new Error('No session ID found');
    }
    
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/invite/`,
      { username },
      {
        headers: {
          'Content-Type': 'application/json',
          'session-id': sessionId
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    // Simplified error handling
    console.error('Error creating invite');
    throw new Error('Failed to create invite');
  }
};

export interface InviteInfo {
  username: string;
  points: number;
  image_link: string;
}

export const getInviteInfo = async (inviteId: string): Promise<InviteInfo> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/invite/${inviteId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.data;
  } catch (error) {
    // Simplified error handling
    console.error('Error getting invite info');
    throw new Error('Failed to get invite info');
  }
};
