import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideAnimations(), // Required for animations
  provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-full-width',
      preventDuplicates: true,
      enableHtml: true,
      closeButton: true,
      progressBar: true,
    }), // Toastr providers
  ],
};
