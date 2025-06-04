import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { PublicModule } from '../../public.module';
import { PasswordChangeService } from '../../services/password-change/password-change.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PublicModule],
  templateUrl: './confirm-new-password.component.html',
  styleUrls: ['./confirm-new-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmNewPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private passwordChangeService = inject(PasswordChangeService);
  private route = inject(ActivatedRoute);

  confirmPasswordForm!: FormGroup;
  passwordVisible = false;
  isLoading = this.passwordChangeService.isLoading;

  ngOnInit(): void {
    this.confirmPasswordForm = this.fb.group({
      confirmPassword: [null, [Validators.required, this.passwordMatchValidator()]],
    });
     this.passwordChangeService.setStep(3); // 设置当前步骤为 3
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const confirmPassword = control.value;
      const newPassword = this.route.snapshot.queryParams['new'];
      return newPassword && confirmPassword === newPassword ? null : { passwordMismatch: true };
    };
  }

  submitStep(): void {
    if (this.confirmPasswordForm.invalid) {
      Object.values(this.confirmPasswordForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.passwordChangeService.submitChange();
  }

  goBack(): void {
    this.passwordChangeService.goBack();
  }
}
