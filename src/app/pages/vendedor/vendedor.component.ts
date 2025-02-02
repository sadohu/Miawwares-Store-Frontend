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
import { SwalCustoms } from '../../Utils/SwalCustoms';

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
  listItems = signal<VendedorDto[]>([]);
  selectedItems: VendedorDto[] = [];
  roles: Rol[] = [];

  // Dialog
  item!: VendedorDto;
  uploadedFiles: File[] = [];
  @ViewChild('fileUploader') fileUploader: any;

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
  isItemDialogEdit: boolean = false;

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
    this.getVendedores();

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
      { field: 'estado', header: 'Estado' },
    ];

    this.exportColumns = this.columns.map((col) => ({ title: col.header, dataKey: col.field }));

  }


  /* INIT CRUD VENDEDORES */
  getVendedores() {
    this.vendedorService.getVendedores().subscribe((data) => {
      // console.log("Vendedores: ", data);
      const vendedores = data.map((vendedor: VendedorDto) => {
        const rol = this.roles.find(rol => rol.idRol === vendedor.idRol);
        return { ...vendedor, rol: rol?.nombreRol };
      });
      // console.log("Vendedores1: ", vendedores);

      this.listItems.set(vendedores);
    });
  }

  /**
     * Evento que se dispara al seleccionar un archivo
     * @param event Evento de cambio de archivo
     * @returns void
     */
  onFileChange(event: any) {
    const file = event.files[0]; // Obtener el primer archivo subido
    if (file) {
      this.uploadedFiles = [file];
      console.log("Archivo seleccionado: ", file);
    }
  }

  createVendedor() {
    // set formData
    let formData = new FormData();
    try {
      formData = this.vendedorService.setFormData(this.item, this.uploadedFiles[0]);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Complete correctamente el formulario" });
      return;
    }

    // init Save Vendedor
    this.vendedorService.saveVendedor(formData).subscribe({
      error: error => {
        console.error('There was an error!', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
      },
      next: data => {
        console.log("Vendedor creado: ", data);

        // Resetear item y uploadedFiles
        this.fileUploader.clear();
        this.uploadedFiles = [];
        this.item = {};

        // Mostrar mensaje de éxito
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vendedor creado' });

        // Actualizar la lista de vendedores
        // TODO: Arreglar ROLES
        data.rol = this.getRol(data.idRol);
        this.listItems.update((items) => [...items, { ...data }]);
      }
    });
    // end Save Vendedor
  }

  updateVendedor() {
    // set formData
    let formData = new FormData();
    try {
      formData = this.vendedorService.setFormData(this.item, this.uploadedFiles[0]);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Complete correctamente el formulario" });
      return;
    }

    this.vendedorService.updateVendedor(this.item.idVendedor!, formData).subscribe({
      error: error => {
        console.error('There was an error!', error);
      },

      next: data => {
        console.log("Vendedor actualizado: ", data);
        // Actualizar el vendedor en la lista
        const vendedores = this.listItems().map((vendedor: VendedorDto) => {
          if (vendedor.idVendedor === this.item.idVendedor) {
            return { ...data, rol: this.getRol(data.idRol) };
          }
          return vendedor;
        });

        // Actualizar la lista de vendedores
        this.listItems.set(vendedores);

        // Resetear item y uploadedFiles
        this.fileUploader.clear();
        this.hideDialog();
        this.item = {};

        // Mostrar mensaje de éxito
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vendedor actualizado' });
      }
    });
  }

  deleteItem(item: VendedorDto) {
    SwalCustoms.confirm("¿Estás seguro de eliminar este vendedor?", "No podrás revertir esta acción").then((result: any) => {
      if (result) {
        this.vendedorService.deleteVendedor(item.idVendedor!).subscribe({
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
          },
          next: data => {
            console.log("Vendedor eliminado: ", data);
            // Actualizar la lista de vendedores
            const vendedores = this.listItems().filter((vendedor: VendedorDto) => vendedor.idVendedor !== item.idVendedor);

            // Actualizar la lista de vendedores
            this.listItems.set(vendedores);

            // Mostrar mensaje de éxito
            this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Vendedor eliminado' });
          }
        });
      }
    });
  }
  /* END CRUD VENDEDORES */


  /* INICIO ACTUALIZAR ESTADO VENDEDOR */
  stateChange(item: Vendedor, toggle: any) {
    SwalCustoms.confirm(`¿Estás seguro de cambiar el estado de ${item.nombre} a ${item.estado ? 'Activo' : 'Inactivo'}`, "Podrás revertir esta acción luego").then((result: any) => {
      // Si el usuario confirma
      if (result) {
        // Deshabilitar el toggle
        toggle.readonly = true;

        // Actualizar el estado del vendedor
        this.vendedorService.updateEstadoVendedor(item.idVendedor!).subscribe({
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar al Empleado' });
            // Habilitar el toggle y revertir el estado
            toggle.readonly = false;
            item.estado = !item.estado;
          },
          next: data => {
            // console.log("Vendedor actualizado: ", data);
            const { message, vendedor } = data;

            // Actualizar el vendedor en la lista
            item.estado = vendedor.estado;

            // Mostrar mensaje de éxito
            this.messageService.add({ severity: 'success', summary: 'Success', detail: message });

            // Habilitar el toggle
            toggle.readonly = false;
          }
        });
      }

      // Si el usuario cancela
      else {
        item.estado = !item.estado;
      }
    });
  }

  /* FIN ACTUALIZAR ESTADO VENDEDOR */

  /* INIT ELIMINACION MULTIPLE */
  deleteMultipleItem() {
    SwalCustoms.confirm("¿Estás seguro de eliminar a los vendedores seleccionados?", "No podrás revertir esta acción").then((result: any) => {
      // Si el usuario confirma
      if (result) {
        // Validar que se haya seleccionado al menos un vendedor
        if (this.selectedItems.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Selecciona al menos un vendedor' });
          return;
        }

        // Custom body (documentación de la API)
        const vendedores = this.selectedItems.map((vendedor: VendedorDto) => {
          return { id: vendedor.idVendedor };
        })

        console.log("Vendedores seleccionados: ", vendedores);

        // Llamar al servicio para eliminar los vendedores
        this.vendedorService.deleteMultiVendedores(vendedores).subscribe({
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
          },
          next: data => {
            // console.log("Vendedores eliminados: ", data);
            const { message } = data;
            // Eliminar los vendedores de la lista segun el id
            const vendedores = this.listItems().filter((vendedor: VendedorDto) => !this.selectedItems.some((item) => item.idVendedor === vendedor.idVendedor));

            // Actualizar la lista de vendedores
            this.listItems.set(vendedores);

            // Mostrar mensaje de éxito
            this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
          }
        });
      }
    });
  }
  /* FIN ELIMINACION MULTIPLE */


  /* INICIO FILTRO GLOBAL */
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  /* FIN FILTRO GLOBAL */


  /* INICIO ACCIONES DEL DIALOG */
  openNew() {
    this.item = {};
    this.submitted = false;
    this.itemDialog = true;
    this.isItemDialogEdit = false;
  }

  editItem(item: Vendedor) {
    this.item = { ...item };
    this.itemDialog = true;
    this.isItemDialogEdit = true;
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
    this.uploadedFiles = [];
    this.isItemDialogEdit = false;
  }
  /* FIN ACCIONES DEL DIALOG  */


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

}
