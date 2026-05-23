import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { MyComponentComponent } from './my-component.component';

@NgModule({
  imports: [CommonModule, TranslocoModule],
  declarations: [MyComponentComponent],
  exports: [MyComponentComponent],
})
export class MyComponentModule {}
