import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LiveStreamComponent } from './live-stream/live-stream.component';
import { ReceiveStreamComponent } from './receive-stream/receive-stream.component';
import { ClassComponent } from './class/class.component';
import { ClassauthComponent } from './classauth/classauth.component';
import { JoinclassComponent } from './joinclass/joinclass.component';
import { IssueshowComponent } from './issueshow/issueshow.component';

const LiveRoutes: Routes = [
      { path: '',  redirectTo:"class" },
      { path: 'class',  component: ClassComponent },
      { path: 'issueshow',  component: IssueshowComponent },
      { path: 'live',  component: LiveStreamComponent },
      { path: 'live/:type/:id',  component: LiveStreamComponent },
      { path: 'classauth', component:ClassauthComponent},
      { path: 'classauth/:id', component:ClassauthComponent},
      { path: 'receive/:type/:id', component: ReceiveStreamComponent },
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
  declarations: [LiveStreamComponent, ReceiveStreamComponent, ClassComponent, ClassauthComponent, JoinclassComponent, IssueshowComponent]
})
export class LiveModule { }
