import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormDisableControlDirective } from '../core/directives/form-disable-control.directive';
import { OcticonDirective } from '../core/directives/octicon.directive';
import { ErrorToasterModule } from './error-toasters/error-toaster.module';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, MaterialModule, ErrorToasterModule],
  declarations: [FormDisableControlDirective, OcticonDirective],
  exports: [
    FormDisableControlDirective,
    OcticonDirective,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    ErrorToasterModule
  ]
})
export class SharedModule {}
