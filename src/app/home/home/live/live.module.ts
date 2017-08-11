import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LiveStreamComponent } from './live-stream/live-stream.component';
import { ReceiveStreamComponent } from './receive-stream/receive-stream.component';
import { ClassComponent } from './class/class.component';
import { ClassauthComponent } from './classauth/classauth.component';
import { JoinclassComponent } from './joinclass/joinclass.component';

const LiveRoutes: Routes = [
      { path: '',  redirectTo:"class" },
      { path: 'class',  component: ClassComponent },
      { path: 'live',  component: LiveStreamComponent },
      { path: 'classauth', component:ClassauthComponent},
      { path: 'classauth/:id', component:ClassauthComponent},
      { path: 'receive/:id', component: ReceiveStreamComponent },
      { path: 'joinclass/:id', component: JoinclassComponent }
    ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(LiveRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [LiveStreamComponent, ReceiveStreamComponent, ClassComponent, ClassauthComponent, JoinclassComponent]
})
export class LiveModule { }
