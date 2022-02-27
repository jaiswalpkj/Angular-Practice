import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngualrMaterialModule } from '../angular-material-module';
import { PostListComponent } from '../post-list/post-list.component';
import { PostCreateComponent } from './post-create.component';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    CommonModule,
    AngualrMaterialModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class PostModule {}
