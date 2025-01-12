import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  checked: boolean = false;
  user: User = new User();

  constructor(private authService: AuthService) { }

  logIng() {
    this.user.username = this.email;
    this.user.password = this.password

    this.authService.logIn(this.user).subscribe((data) => {
      this.user.accessToken = data.accessToken;
      this.user.refreshToken = data.refreshToken;
      console.log(this.user);
    });

  }
}
