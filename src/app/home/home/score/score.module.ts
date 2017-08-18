import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScoresComponent } from './scores/scores.component';
import { ScoreissueComponent } from './scoreissue/scoreissue.component';
import { ScoreplayComponent } from './scoreplay/scoreplay.component';

const ScoreRoutes: Routes = [
  { path: '',  redirectTo:"scores" },
  { path: 'scores',  component: ScoresComponent },
  { path: 'scoreissue',  component: ScoreissueComponent },
  { path: 'scoreplay/:id',  component: ScoreplayComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(ScoreRoutes)
  ],
  declarations: [ScoresComponent, ScoreissueComponent, ScoreplayComponent]
})
export class ScoreModule { }
