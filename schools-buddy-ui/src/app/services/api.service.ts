import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';

export interface UserDto {
  name: string;
  age: number;
  registered: string;
  email: string;
  balance: string;
  iconPath: string;
}

export interface MappedUserDto {
  name: string;
  age: number;
  registered: Date;
  email: string;
  balance: number;
  iconPath: string;
}

export interface IconDto {
  value: string; // base64
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  private iconCache = new Map<string, string>();

  getUsers() {
    return this.http.get<UserDto[]>(`${this.baseUrl}/api/Users`);
  }

  getIcon(name: string) {
    return this.http.get<string>(`${this.baseUrl}/api/Icons/${name}`);
  }
}
