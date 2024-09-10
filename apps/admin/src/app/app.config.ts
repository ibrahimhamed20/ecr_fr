import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { appRoutes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideSpinnerConfig } from 'ngx-spinner';
import { provideToastr } from 'ngx-toastr';
import { APP_INTERCEPTORS, CORE_PROVIDORS, TranslationService } from '@shared-utils';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function initializeApp(translationService: TranslationService) {
  return (): Promise<void> => {
    return translationService.loadTranslations().toPromise();
  };
}
// Factory function to create TranslateLoader instance
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptors(APP_INTERCEPTORS)),
    provideSpinnerConfig({ type: 'ball-scale-multiple' }),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      })
    ),
    provideToastr(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [TranslationService],
      multi: true
    },
    ...CORE_PROVIDORS
  ]
};
