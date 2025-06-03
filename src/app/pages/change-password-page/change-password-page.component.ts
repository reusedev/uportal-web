/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PasswordChangeService } from '../../services/password-change/password-change.service';
import { PublicModule } from '../../public.module';
import { AuthService, AuthTokenPayload } from '../../services/auth.service';
import { RoleDict } from '../../configs/dict';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PublicModule],
  templateUrl: './change-password-page.component.html',
  styleUrls: ['./change-password-page.component.css'], // This will be an empty file
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordPageComponent implements OnInit {
  passwordChangeService = inject(PasswordChangeService);

  roleDict:any = RoleDict;

  auth = inject(AuthService);

  userInfo: any = {};

  ngOnInit(): void {
    const payload = this.auth.decode(this.auth.get()) as AuthTokenPayload & {
      username: string;
      password: string;
      role: string;
    };

    this.userInfo = payload || {};
  }
}
