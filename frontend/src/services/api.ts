// Base URL for API calls (BFF)
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";


export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  name: string;
  username: string;
  role: string;
}

export interface EmployeeRequest {
  name: string;
  username: string;
  password?: string;
}

export interface EmployeeResponse {
  id: number;
  name: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface ShiftResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  clockIn: string;
  clockOut: string | null;
  totalHours: number | null;
}

export interface WeeklyHoursResponse {
  employeeId: number;
  employeeName: string;
  totalWeeklyHours: number;
  shifts: ShiftResponse[];
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(includeAuth = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  private async request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const customHeaders = options.headers as Record<string, string> | undefined;
  const hasAuth = customHeaders?.Authorization !== undefined;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(!hasAuth),
        ...(customHeaders || {}),
      },
    });

    if (!response.ok) {
      // Parse error JSON or fallback to text
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const text = await response.text();
        if (text) {
          const parsed = JSON.parse(text);
          errorMessage = parsed.error || parsed.message || errorMessage;
        }
      } catch {
        // ignore parse error, keep default message
      }
      throw new Error(errorMessage);
    }

    // ✅ Handle 204 No Content properly
    if (response.status === 204) {
      return undefined as T;
    }

    // ✅ Try reading body safely (avoid JSON parse on empty body)
    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    return JSON.parse(text) as T;

  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error: Unable to connect to server");
  }
}


  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: this.getHeaders(false),
    });
  }

  // Admin endpoints
  async createEmployee(employee: EmployeeRequest): Promise<EmployeeResponse> {
    return this.request<EmployeeResponse>('/admin/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(
    id: number,
    employee: EmployeeRequest
  ): Promise<EmployeeResponse> {
    return this.request<EmployeeResponse>(`/admin/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  }

  async deleteEmployee(id: number): Promise<void> {
    return this.request<void>(`/admin/employees/${id}`, {
      method: 'DELETE',
    });
  }

  async getAllEmployees(): Promise<EmployeeResponse[]> {
    return this.request<EmployeeResponse[]>('/admin/employees');
  }

  async getAllEmployeesWeeklyHours(): Promise<WeeklyHoursResponse[]> {
    return this.request<WeeklyHoursResponse[]>('/admin/weekly-hours');
  }

  // Employee endpoints
  async clockIn(): Promise<ShiftResponse> {
    return this.request<ShiftResponse>('/shifts/clock-in', {
      method: 'POST',
    });
  }

  async clockOut(): Promise<ShiftResponse> {
    return this.request<ShiftResponse>('/shifts/clock-out', {
      method: 'POST',
    });
  }

  async getActiveShift(): Promise<ShiftResponse | null> {
    try {
      return await this.request<ShiftResponse>('/shifts/active');
    } catch (error) {
      return null;
    }
  }

  async getWeeklyHours(): Promise<WeeklyHoursResponse> {
    return this.request<WeeklyHoursResponse>('/shifts/weekly-hours');
  }
}

export const apiService = new ApiService();
