import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule, TablePageEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Menu, MenuModule } from 'primeng/menu';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { TableConfig } from './table.interface';
import { TranslateModule } from '@ngx-translate/core';

const PRIMENG_MODULE = [TableModule, FileUploadModule, ButtonModule, RippleModule, RatingModule, InputTextModule, MenuModule];

@Component({
  selector: 'shared-ui-table',
  standalone: true,
  imports: [CommonModule, FormsModule,TranslateModule ,...PRIMENG_MODULE],
  providers: [DialogService],
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() config!: TableConfig | null;
  @Output() actionClicked = new EventEmitter<{ action: string; data?: any }>(true);
  @Output() onPage: EventEmitter<PaginatorState> = new EventEmitter<PaginatorState>(true);
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>(true);

  @ContentChild('actions', { static: false }) actionsTemplateRef!: TemplateRef<any>;

  showFilter: boolean = false;
  selectedRows: any[] = [];
  allowedActions: MenuItem[] = [];

  onFilter(table: Table, event: Event) {
    debugger
    const keyword = (event.target as HTMLInputElement).value;
    if (this.config?.dataLoading === 'server') this.onSearch.emit(keyword);
    else table.filterGlobal(keyword, 'contains');
  }

  get exportedColumns(): any[] {
    return this.config?.columns.filter((el) => el.exported) || [];
  }

  toggleMenu(ev: any, row: any, menu: Menu) {
    this.allowedActions = this.getMenuItems(row);
    menu.toggle(ev);
  }

  getMenuItems(row: any): MenuItem[] {
    return this.config?.rowsActions?.map(el => ({
      label: el,
      icon: el === 'DELETE' ? 'pi pi-trash' : 'pi pi-pencil',
      command: () => this.actionClicked.emit({ action: el, data: row })
    })) || [];
  }

  onPageChange(ev: TablePageEvent) {
    this.onPage.emit({
      ...ev,
      page: (ev.first / ev.rows) + 1,
      pageCount: this.config?.rowsPerPage
    });
  }

  onExport(table: Table) {
    if (this.config?.dataLoading === 'server') this.actionClicked.emit({ action: 'EXPORT' });
    else table.exportCSV();
  }
}

