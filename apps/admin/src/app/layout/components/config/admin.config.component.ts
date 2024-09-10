import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { LayoutService } from '@admin-layout/services';

const PRIME_NG_MODULES = [
    SidebarModule,
    RadioButtonModule,
    ButtonModule,
    InputSwitchModule,
    TooltipModule
];

@Component({
    selector: 'admin-config',
    templateUrl: './admin.config.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ...PRIME_NG_MODULES]
})
export class AdminConfigComponent {
    @Input() minimal: boolean = false;

    scales: number[] = [12, 13, 14, 15, 16];

    constructor(public _layout: LayoutService) { }

    get visible(): boolean {
        return this._layout.state.configSidebarVisible;
    }
    set visible(_val: boolean) {
        this._layout.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this._layout.config().scale;
    }
    set scale(_val: number) {
        this._layout.config.update((config) => ({
            ...config,
            scale: _val,
        }));
    }

    get menuMode(): string {
        return this._layout.config().menuMode;
    }
    set menuMode(_val: string) {
        this._layout.config.update((config) => ({
            ...config,
            menuMode: _val,
        }));
    }

    get inputStyle(): string {
        return this._layout.config().inputStyle;
    }
    set inputStyle(_val: string) {
        this._layout.config().inputStyle = _val;
    }

    get ripple(): boolean {
        return this._layout.config().ripple;
    }
    set ripple(_val: boolean) {
        this._layout.config.update((config) => ({
            ...config,
            ripple: _val,
        }));
    }

    set theme(val: string) {
        this._layout.config.update((config) => ({
            ...config,
            theme: val,
        }));
    }
    get theme(): string {
        return this._layout.config().theme;
    }

    set colorScheme(val: string) {
        this._layout.config.update((config) => ({
            ...config,
            colorScheme: val,
        }));
    }
    get colorScheme(): string {
        return this._layout.config().colorScheme;
    }

    onConfigButtonClick() {
        this._layout.showConfigSidebar();
    }

    changeTheme(theme: string, colorScheme: string) {
        this.theme = theme;
        this.colorScheme = colorScheme;
    }

    decrementScale() {
        this.scale--;
    }

    incrementScale() {
        this.scale++;
    }
}
