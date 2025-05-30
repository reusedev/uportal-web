import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';

export interface AuthTokenPayload {
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  exp: number;
  iat: number;
  nbf: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  readonly key = 'UPORTAL_WEB_TOKEN';

  get(): string|null {
    const content = window.localStorage.getItem(this.key);
    const valid = this.check(content);
    return valid ? content : null;
  }

  set(value: string|null) {
    const valid = this.check(value);
    if (valid) {
      window.localStorage.setItem(this.key, value as string);
    }
  }

  clear() {
    window.localStorage.removeItem(this.key);
  }

  check(token: string|null): boolean {
    const payload = this.decode(token);
    const exp = payload?.exp ?? 0;
    const now = Math.ceil(new Date().getTime() / 1000);
    return exp > now;
  }

  decode(token: string|null): AuthTokenPayload | null {
    if (token) {
      try {
        const [ , payload ] = token.split('.');
        return JSON.parse(Base64.decode(payload));
      } catch {
        return null;
      }
    } else {
      return null;
    }
  }

 login(url: string) {
    const referer = encodeURIComponent(`${window.location.origin}/redirect?referer=${encodeURIComponent(url)}`);
    window.location.replace(`${window.location.origin}/login?referer=${referer}`);
  }

   logout() {
    this.clear();
    window.location.replace(`${window.location.origin}/login`);
  }

}
