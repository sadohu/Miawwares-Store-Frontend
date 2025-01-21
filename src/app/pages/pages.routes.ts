import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { VendedorComponent } from './vendedor/vendedor.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'vendedor', component: VendedorComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
