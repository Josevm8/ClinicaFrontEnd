import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ServerErrorsInterceptor } from './interceptor/server-error.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment.development';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export function tokenGetter(){
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(),
    //provideHttpClient() //Configuracion clasica de HttpClient
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          //allowedDomains: ["104.131.170.146/mediapp-backend"],
          allowedDomains: ["localhost:8080"], //Propagar el token en todas las peticiones
          //disallowedRoutes: ["http://104.131.170.146/mediapp-backend/login/forget"]
          disallowedRoutes: ["http://localhost:8080/login/forget"] //No propaga para esta ruta especifica
        },
      })
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy, useClass: HashLocationStrategy
    }
  ]
};