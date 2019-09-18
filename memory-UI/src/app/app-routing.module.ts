import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'start', loadChildren: './start/start.module#StartPageModule' },
  { path: 'level', loadChildren: './level/level.module#LevelPageModule' },
  { path: 'key-list', loadChildren: './key-list/key-list.module#KeyListPageModule' },
  { path: 'enter-code', loadChildren: './enter-code/enter-code.module#EnterCodePageModule' },
  { path: 'game', loadChildren: './game/game.module#GamePageModule' },
  { path: 'join-key', loadChildren: './join-key/join-key.module#JoinKeyPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule]
})  
export class AppRoutingModule { }
