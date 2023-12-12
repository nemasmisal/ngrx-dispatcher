import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    "id": number,
    "name": String,
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  loadUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
  }

  loadUserById(id: string): Observable<User> {
    return this.http.get<User>('https://jsonplaceholder.typicode.com/users/' + id);
  }
}
