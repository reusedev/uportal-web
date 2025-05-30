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
  Validators,
} from '@angular/forms';
import { PublicModule } from '../../public.module'; // Assuming this includes NzInput, NzButton, NzForm etc.
import { PasswordChangeService } from '../../services/password-change/password-change.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enter-old-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PublicModule],
  templateUrl: './enter-old-password.component.html',
  styleUrls: ['./enter-old-password.component.css'], // This will be an empty file
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterOldPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private passwordChangeService = inject(PasswordChangeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  oldPasswordForm!: FormGroup;

  ngOnInit(): void {
    this.oldPasswordForm = this.fb.group({
      oldPassword: [
        this.route.snapshot.queryParams['old'] || null,
        [Validators.required],
      ],
    });

    this.passwordChangeService.setStep(1); // 设置当前步骤为 1

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
