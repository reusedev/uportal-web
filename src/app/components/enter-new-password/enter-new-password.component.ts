import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { PublicModule } from '../../public.module';
import { PasswordChangeService } from '../../services/password-change/password-change.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-enter-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PublicModule],
  templateUrl: './enter-new-password.component.html',
  styleUrls: ['./enter-new-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterNewPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private passwordChangeService = inject(PasswordChangeService);
  private location = inject(Location);
  private route = inject(ActivatedRoute);

  newPasswordForm!: FormGroup;
  passwordVisible = false;

  ngOnInit(): void {
    this.newPasswordForm = this.fb.group({
      newPassword: [this.route.snapshot.queryParams['new'] || null, [Validators.required, Validators.minLength(6), this.oldPasswordMismatchValidator()]],
    });
     this.passwordChangeService.setStep(2); // 设置当前步骤为 2
  }

  oldPasswordMismatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.value;
      const oldPassword = this.route.snapshot.queryParams['old'];
      return oldPassword && newPassword === oldPassword ? { oldPasswordMismatch: true } : null;
    };
  }

  submitStep(): void {
    if (this.newPasswordForm.invalid) {
      Object.values(this.newPasswordForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const newPassword = this.newPasswordForm.value.newPassword;
    this.passwordChangeService.setNewPassword(newPassword);
  }

  goBack(): void {
    this.passwordChangeService.goBack();
  }
}
