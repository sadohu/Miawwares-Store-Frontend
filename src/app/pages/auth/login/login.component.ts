import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RedirectCommand, RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../../services/auth.service';
import { Auth } from '../../../models/auth.model';
import { HttpStatusCode } from '@angular/common/http';
import { User } from '../../../models/user.model';
import { SwalCustoms } from '../../../Utils/SwalCustoms';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  checked: boolean = false;
  auth: Auth = new Auth();
  user: User = new User();

  constructor(private authService: AuthService, private router: Router) { }

  logIng() {
    this.auth.username = this.email;
    this.auth.password = this.password

    this.authService.logIn(this.auth).subscribe({
      // Manage errors
      error: (error) => {
        if (error.status == HttpStatusCode.Unauthorized) {
          const msg = error.error.error;
          SwalCustoms.error("Credenciales incorrectas");
          console.log(msg);
          return;
        } else {
          console.log(error);
        }
      },

      // Manage response
      next: (response) => {
        // Eliminar password de Auth
        this.auth.password = undefined;

        // Guardar tokens en Auth
        this.auth.accessToken = response.accessToken;
        this.auth.refreshToken = response.refreshToken;

        // Guardar usuario en User
        this.user = response.user;

        // Guardar Auth y User en SessionStorage
        this.authService.saveAuthOnSessionStorage(this.auth);
        this.authService.saveUserOnSessionStorage(this.user);

        // Redirigir a Home
        this.router.navigate(['/']);
      }
    });

  }
}
