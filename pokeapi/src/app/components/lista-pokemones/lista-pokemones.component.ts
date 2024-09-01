import { Component, OnInit  } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-pokemones',
  templateUrl: './lista-pokemones.component.html',
  styleUrl: './lista-pokemones.component.css'
})

export class ListaPokemonesComponent implements OnInit {

  pokemonList: any[] = [];
  totalPokemons: number = 0;
  pageSize: number = 20;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  constructor(
    private pokeApiService: PokemonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons(event?: PageEvent) {
    const offset = event ? event.pageIndex * event.pageSize : 0;
    const limit = event ? event.pageSize : this.pageSize;

    this.pokeApiService.getPokemonList(limit, offset).subscribe(
      (data: any) => {
        this.pokemonList = data.results;
        this.totalPokemons = data.count;
        this.loadPokemonImages();
      },
      error => {
        console.error('Error fetching Pokemon list:', error);
      }
    );
  }

  loadPokemonImages() {
    this.pokemonList.forEach(pokemon => {
      this.pokeApiService.getPokemonDetails(pokemon.name).subscribe(
        (details: any) => {
          pokemon.imageUrl = details.sprites.front_default;
        },
        error => {
          console.error(`Error fetching details for ${pokemon.name}:`, error);
        }
      );
    });
  }

  onPageChange(event: PageEvent) {
    this.loadPokemons(event);
  }

  onPokemonClick(pokemonName: string) {
    this.router.navigate(['/pokemon', pokemonName]);
  }
}

