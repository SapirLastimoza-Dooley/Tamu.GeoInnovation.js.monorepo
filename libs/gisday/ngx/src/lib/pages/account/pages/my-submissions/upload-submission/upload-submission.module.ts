import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UIFormsModule } from '@tamu-gisc/ui-kits/ngx/forms';
import { UILayoutModule } from '@tamu-gisc/ui-kits/ngx/layout';

import { UploadSubmissionComponent } from './upload-submission.component';

const routes: Routes = [
  {
    path: '',
    component: UploadSubmissionComponent
  }
];

@NgModule({
  declarations: [UploadSubmissionComponent],
  imports: [CommonModule, RouterModule.forChild(routes), UIFormsModule, UILayoutModule],
  exports: [RouterModule]
})
export class UploadSubmissionModule {}
