import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { LoginService } from '../services/login.service';
import { AuthService } from '../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly loginService = inject(LoginService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  isFormValid = toSignal(
    this.loginForm.statusChanges.pipe(
      map(status => status === 'VALID')
    ),
    { initialValue: this.loginForm.valid }
  );

  isLoggingIn = signal(false);
  loginError = signal(false);

  login() {
    if (this.loginForm.valid) {
      this.isLoggingIn.set(true);
      this.loginError.set(false);
      this.loginService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: (data) => {
          sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
          this.authService.cargarUsuarioActual().subscribe(usuario => {
            this.authService.setUsuarioActual(usuario);
            this.router.navigate(['/pages/dashboard']);
          });
        },
        error: () => {
          this.isLoggingIn.set(false);
          this.loginError.set(true);
        }
      });
    }
  }
}