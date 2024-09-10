import { Component, Input, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'shared-ui-tabs',
  standalone: true,
  imports: [CommonModule, TabMenuModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements OnInit {
  @Input() tabs: MenuItem[] = [];
  @Input() activeIndex: number = 0;

  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  private dynamicContainer!: ViewContainerRef;

  activeItem!: MenuItem;

  ngOnInit(): void {
    this.activateTab(this.tabs[this.activeIndex || 0]);
  }

  activateTab(tab: MenuItem): void {
    this.activeItem = tab;
    this.activeIndex = this.tabs.indexOf(tab);
    this.dynamicContainer.clear();
    tab?.['component'] && this.dynamicContainer.createComponent(tab['component']);
    // when i will create no data component i will push it here if no tab component found
  }

}
