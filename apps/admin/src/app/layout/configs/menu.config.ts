import { MenuItem } from "primeng/api";

export const MAIN_MENU_ITEMS: MenuItem[] = [
    {
        label: 'Root',
        items: [
            { label: 'Overview', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
            {
                label: 'Store Management',
                icon: 'pi pi-fw pi-warehouse',
                items: [
                    { label: 'Stores', icon: 'pi pi-fw pi-bookmark', routerLink: ['/merchants/stores'] },
                    { label: 'Reports', icon: 'pi pi-fw pi-bookmark', routerLink: ['/merchants/reports'] },
                    { label: 'Trackers', icon: 'pi pi-fw pi-bookmark', routerLink: ['/merchants/trackers'] },
                ]
            },
            {
                label: 'Admins',
                icon: 'pi pi-fw pi-user',
                items: [
                    { label: 'System Admins', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admins'] },
                    { label: 'Roles', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admins/reports'] },
                ]
            },
            {
                label: 'Subscriptions',
                icon: 'pi pi-fw pi-wallet',
                items: [
                    { label: 'Subscription', icon: 'pi pi-fw pi-bookmark', routerLink: ['/subscriptions/subscription'] },
                    { label: 'Roles', icon: 'pi pi-fw pi-bookmark', routerLink: ['/subscriptions/roles'] },
                ]
            },
            {
                label: 'Customers',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/customers']
            },
            {
                label: 'Products Management',
                icon: 'pi pi-fw pi-database',
                items: [
                    { label: 'Products', icon: 'pi pi-fw pi-bookmark', routerLink: ['/products'] },
                    { label: 'Merchant Products', icon: 'pi pi-fw pi-bookmark', routerLink: ['products/merchant'] },
                    { label: 'Product Metadata', icon: 'pi pi-fw pi-bookmark', routerLink: ['/products/metadata'] },
                    { label: 'Product Catalog', icon: 'pi pi-fw pi-bookmark', routerLink: ['/products/catalog'] },
                    { label: 'Units', icon: 'pi pi-fw pi-bookmark', routerLink: ['/products/units'] },
                    { label: 'Categories', icon: 'pi pi-fw pi-bookmark', routerLink: ['/products/categories'] },

                    { label: 'Product Catalog', icon: 'pi pi-fw pi-bookmark', routerLink: ['/products/products-catalog'] }
                ]
            },
            {
                label: 'Accounting',
                icon: 'pi pi-fw pi-wallet',
                routerLink: ['/accounting']
            },
            {
                label: 'Marketplace',
                icon: 'pi pi-fw pi-shop',
                routerLink: ['/marketplace']
            },
            {
                label: 'Reports',
                icon: 'pi pi-fw pi-chart-line',
                routerLink: ['/reports']
            },
            {
                label: 'Settings',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { label: 'Merchants Settings', icon: 'pi pi-fw pi-bookmark', routerLink: ['/settings/merchants'] },
                    { label: 'Roles', icon: 'pi pi-fw pi-bookmark', routerLink: ['/settings/roles'] },

                ]
            },
            {
                label: 'Data Catalog', icon: 'pi pi-fw pi-globe', items: [
                    { label: 'Products Catalog', icon: 'pi pi-fw pi-bookmark', routerLink: ['/product-catalog'] },
                    { label: 'Addresses', icon: 'pi pi-fw pi-bookmark', routerLink: ['/addresses'] }
                ]
            }
        ]
    }
];

