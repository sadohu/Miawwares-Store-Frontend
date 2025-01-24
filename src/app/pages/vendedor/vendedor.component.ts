import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { SHARED_MODULES, SHARED_SERVICES } from '../../../app.module';
import { ConfirmationService, MessageService, ToastMessageOptions } from 'primeng/api';
import { Table } from 'primeng/table';

import { Product, ProductService } from '../service/product.service';
import { Vendedor } from '../../models/vendedor.model';
import { VendedorDto } from '../../models/models-dto/vendedor-dto.model';
import { VendedorService } from '../../services/vendedor.service';
import { Rol } from '../../models/rol.model';
import { RolService } from '../../services/rol.service';
import { UtilServiceService } from '../../services/util-service.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-vendedor',
  imports: [...SHARED_MODULES],
  providers: [...SHARED_SERVICES, MessageService, ProductService, ConfirmationService],
  templateUrl: './vendedor.component.html',
  styleUrl: './vendedor.component.scss'
})
export class VendedorComponent implements OnInit {

  // Vendedores
  itemDialog: boolean = false;
  // listItems: Vendedor[] = [];
  listItems = signal<VendedorDto[]>([]);
  selectedItems: Vendedor[] = [];
  roles: Rol[] = [];
  // Dialog
  item!: VendedorDto;
  uploadedFiles: File[] = [];


  // Utils
  msgs: ToastMessageOptions[] | null = [];
  submitted: boolean = false;
  statuses!: any[];
  productDialog: boolean = false;
  @ViewChild('dt')
  dt!: Table;
  exportColumns!: ExportColumn[];
  columns!: Column[];
  imageUrl: string | null = null;


  // Others
  products = signal<Product[]>([]);
  product!: Product;
  selectedProducts!: Product[] | null;



  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private vendedorService: VendedorService,
    private rolService: RolService,
    private utilService: UtilServiceService,
  ) { }

  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.rolService.getRoles().subscribe((data) => {
      this.roles = data;
      this.loadData();
    });
  }

  loadData() {
    this.vendedorService.getVendedores().subscribe((data) => {
      console.log("Vendedores: ", data);
      const vendedores = data.map((vendedor: VendedorDto) => {
        const rol = this.roles.find(rol => rol.idRol === vendedor.idRol);
        return { ...vendedor, rol: rol?.nombreRol };
      });
      console.log("Vendedores1: ", vendedores);

      this.listItems.set(vendedores);
    });

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];

    this.columns = [
      { field: 'idVendedor', header: 'Codigo Vendedor', customExportHeader: 'Condigo Vendedor' },
      { field: 'foto', header: 'Foto' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'dni', header: 'DNI' },
      { field: 'tfno', header: 'Telefono' },
      { field: 'email', header: 'Email' },
      { field: 'username', header: 'Usuario' },
      { field: 'rol', header: 'Rol' },
    ];

    this.exportColumns = this.columns.map((col) => ({ title: col.header, dataKey: col.field }));

  }

  // INIT CRUD VENDEDORES
  getVendedores() {
    this.vendedorService.getVendedores().subscribe((data) => {
      console.log("Vendedores: ", data);
    });
  }

  onFileChange(event: any) {
    const file = event.files[0]; // Obtener el primer archivo subido
    if (file) {
      this.uploadedFiles = [file];
      console.log("Archivo seleccionado: ", file);
    }
  }


  createVendedor() {
    // set formData
    const formData = this.vendedorService.setFormData(this.item, this.uploadedFiles[0]);

    // init Save Vendedor
    this.vendedorService.saveVendedor(formData).subscribe({
      error: error => {
        console.error('There was an error!', error);
      },
      next: data => {
        console.log("Vendedor creado: ", data);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vendedor creado' });
      }
    });
    // end Save Vendedor
  }

  updateVendedor() {
    // this.vendedorService.updateVendedor().subscribe((data) => {
    //   console.log("Vendedor actualizado: ", data);
    // });
  }

  deleteVendedor() {
    // this.vendedorService.deleteVendedor().subscribe((data) => {
    //   console.log("Vendedor eliminado: ", data);
    // });
  }

  // END CRUD VENDEDORES

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.item = {};
    this.submitted = false;
    this.itemDialog = true;
  }

  editProduct(item: Vendedor) {
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
    this.uploadedFiles = [];
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(this.products().filter((val) => val.id !== product.id));
        this.product = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000
        });
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products().length; i++) {
      if (this.products()[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  // INICIO ESTILOS PARA TABLA
  getSeverity(rol: string) {
    switch (rol) {
      case 'Administrador':
        return 'success';
      case 'Supervisor':
        return 'warn';
      case 'Vendedor':
        return 'info';
      default:
        return 'danger';
    }
  }

  getRol(idRol: number) {
    const rol = this.roles.find(rol => rol.idRol === idRol);
    return rol?.nombreRol;
  }
  // FIN ESTILOS PARA TABLA

  saveProduct() {
    this.submitted = true;
    let _products = this.products();
    if (this.product.name?.trim()) {
      if (this.product.id) {
        _products[this.findIndexById(this.product.id)] = this.product;
        this.products.set([..._products]);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000
        });
      } else {
        this.product.id = this.createId();
        this.product.image = 'product-placeholder.svg';
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000
        });
        this.products.set([..._products, this.product]);
      }

      this.productDialog = false;
      this.product = {};
    }
  }
}
