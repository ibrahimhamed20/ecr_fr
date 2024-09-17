import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorHandlingService } from './error-handling.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CustomHttpClient } from './custom-http.service';
import { TranslationService } from './translation.service';

export const CORE_PROVIDORS = [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    MessageService,
    ErrorHandlingService,
    CustomHttpClient,
    ConfirmationService,
    TranslationService,

];

export * from './error-handling.service';
export * from './custom-http.service';
export * from './translation.service';
