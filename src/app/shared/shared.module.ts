import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// SERVICES
import { ThemeService } from './services/theme.service';
import { NavigationService } from "./services/navigation.service";
import { RoutePartsService } from './services/route-parts.service';
import { AuthGuard } from './services/auth/auth.guard';
import { AppConfirmService } from './services/app-confirm/app-confirm.service';
import { ErrorDialogService } from './services/error-dialog/error-dialog.service';
import { AppLoaderService } from './services/app-loader/app-loader.service';
import { EncrDecrService } from './services/encrypt-decrypt.service';
import { SharedComponentsModule } from './components/shared-components.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { NotificationService } from './services/notification.service'

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule
  ],
  providers: [
    ThemeService,
    NavigationService,
    RoutePartsService,
    AuthGuard,
    AppConfirmService,
    ErrorDialogService,
    AppLoaderService,
    EncrDecrService,
    NotificationService
  ],
  exports: [
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule
  ]
})
export class SharedModule { }
