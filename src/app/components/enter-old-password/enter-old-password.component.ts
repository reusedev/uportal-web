import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PublicModule } from '../../public.module';
import { PasswordChangeService } from '../../services/password-change/password-change.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-enter-old-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PublicModule],
  templateUrl: './enter-old-password.component.html',
  styleUrls: ['./enter-old-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterOldPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private passwordChangeService = inject(PasswordChangeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  oldPasswordForm!: FormGroup;
  auth = inject(AuthService);
  password!:string;

  ngOnInit(): void {
    const payload: any = this.auth.decode(this.auth.get());
    this.password = payload?.password || '';

    this.oldPasswordForm = this.fb.group({
      oldPassword: [
        this.route.snapshot.queryParams['old'] || null,
        [Validators.required, this.validPassword()],
      ],
    });

    this.passwordChangeService.setStep(1); // 设置当前步骤为 1
  }

  validPassword():ValidatorFn{
    return (control: any) => {
      const oldPassword = control.value;
      return oldPassword === this.password ? null : { passwordMismatch: true };
    };

  }

  submitStep(): void {
    if (this.oldPasswordForm.invalid) {
      Object.values(this.oldPasswordForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const oldPassword = this.oldPasswordForm.value.oldPassword;
    this.passwordChangeService.setOldPassword(oldPassword);
  }
}
