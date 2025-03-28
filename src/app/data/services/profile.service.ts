import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Profile } from '../interfaces/profile.interface';
import { Pageble } from '../interfaces/pageble.interface';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http: HttpClient = inject(HttpClient)
  baseApiUrl = 'https://icherniakov.ru/yt-course/'
  me = signal<Profile | null>(null)
  filteredProfiles = signal<Profile[]>([])

  constructor() { }

  getTestAccounts() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`)
  }

  getAccount(id: string){
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`)
  }


  getSubscribersShortList(subsAmount = 3){
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`).pipe(
      map(res => res.items.slice(0, subsAmount))
    )
  }

  getMe(){
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`).pipe(
      tap(res => this.me.set(res))
    )
  }

  patchProfile(profile: Partial<Profile>){
    return this.http.patch<Profile>(`${this.baseApiUrl}account/me`,
      profile
    )
  }

  uploadImage(file: File){
    const fd = {'image': file}
    return this.http.post(`${this.baseApiUrl}account/upload_image`,
      fd
    )
  }

  filterProfiles(params: Record<string, any>){
     return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/accounts`, {
      params
     }).pipe(
      tap(res => this.filteredProfiles.set(res.items))
     )
  }
}
