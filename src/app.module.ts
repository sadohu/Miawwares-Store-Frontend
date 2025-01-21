// Angular core modules
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';

// PrimeNG services
import { ConfirmationService, MessageService } from 'primeng/api';

// Export all modules and services for easy import
export const SHARED_MODULES = [
  CommonModule,
  FormsModule,
  TableModule,
  ButtonModule,
  RippleModule,
  MessageModule,
  ToastModule,
  ToolbarModule,
  RatingModule,
  InputTextModule,
  TextareaModule,
  SelectModule,
  RadioButtonModule,
  InputNumberModule,
  DialogModule,
  TagModule,
  InputIconModule,
  IconFieldModule,
  ConfirmDialogModule,
  FileUploadModule,
  DropdownModule,
];

export const SHARED_SERVICES = [ConfirmationService, MessageService];