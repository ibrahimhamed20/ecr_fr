type Position = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
export interface PopupConfig { title: string, data?: any, position: Position, closable?: boolean, draggable?: boolean ,styles ?:{ [key: string]: string }; }; 