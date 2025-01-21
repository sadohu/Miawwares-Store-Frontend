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

  productDialog: boolean = false;

  // Vendedores
  itemDialog: boolean = false;
  listItems: VendedorDto[] = [];
  item!: VendedorDto;
  selectedItems!: VendedorDto[] | null;

  roles: Rol[] = [];

  uploadedFiles: File[] = [];

  msgs: ToastMessageOptions[] | null = [];
  imageUrl: string | null = null;


  // Others

  products = signal<Product[]>([]);
  product!: Product;
  selectedProducts!: Product[] | null;

  submitted: boolean = false;
  statuses!: any[];

  @ViewChild('dt')
  dt!: Table;
  exportColumns!: ExportColumn[];
  cols!: Column[];

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
    this.loadDemoData();
    this.rolService.getRoles().subscribe((data) => {
      this.roles = data;
      // console.log("roles: ", this.roles);
      // console.log("roles1: ", this.roles[0]);
    });
  }

  loadDemoData() {
    this.productService.getProducts().then((data) => {
      this.products.set(data);
    });

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];

    this.cols = [
      { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
      { field: 'name', header: 'Name' },
      { field: 'image', header: 'Image' },
      { field: 'price', header: 'Price' },
      { field: 'category', header: 'Category' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  // INIT CRUD VENDEDORES
  getVendedores() {
    this.vendedorService.getVendedores().subscribe((data) => {
      console.log("Vendedores: ", data);
    });
  }

  // onUpload(event: any) {
  //   console.log("uploadedFiles: ", this.uploadedFiles);
  //   const uploadedFiles = event.files[0]; // Obtener el primer archivo subido
  //   console.log("uploadedFiles: ", uploadedFiles);

  //   this.item.fotoFile = this.uploadedFiles;
  //   console.log("this.item.fotoFile: ", this.item.fotoFile);

  //   this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  // }

  createVendedor() {
    console.log("Creando vendedor...");
    console.log("uploadedFiles: ", this.uploadedFiles);
    const formData = new FormData();
    formData.append('nombre', this.item.nombre!);
    formData.append('tfno', this.item.tfno!);
    formData.append('username', this.item.username!);
    formData.append('email', this.item.email!);
    formData.append('dni', this.item.dni!);
    formData.append('password', this.item.password!);
    formData.append('idRol', this.item.idRol!.toString());
    formData.append('foto', this.uploadedFiles[0]);
    console.log("formData: ", formData);


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

    // this.utilService.convertirImagenesABase64(this.uploadedFiles).subscribe((data) => {
    //   // console.log("Imagenes convertidas: ", data);
    //   this.item.foto = data[0].base64;
    //   console.log("Vendedor: ", this.item);




    // });






    // this.vendedorService.createVendedor().subscribe((data) => {
    //   console.log("Vendedor creado: ", data);
    // });
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

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
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

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

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
