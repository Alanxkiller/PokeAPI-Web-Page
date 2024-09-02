import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPokemonesComponent } from './components/lista-pokemones/lista-pokemones.component';
import { PokemonComponent } from './components/pokemon/pokemon.component';
import { MovesComponent } from './components/moves/moves.component';

const routes: Routes = [
  {path: 'home', component: ListaPokemonesComponent},
  {path: 'pokemon/:name', component: PokemonComponent},
  {path: 'moves', component: MovesComponent},
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: '**', pathMatch: 'full', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
