import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';

interface AdjacentPokemon {
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})
export class PokemonComponent implements OnInit {
  pokemon: any;
  spriteUrls: string[] = [];
  prevPokemon: AdjacentPokemon | null = null;
  nextPokemon: AdjacentPokemon | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokeApiService: PokemonService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const pokemonName = params.get('name');
      if (pokemonName) {
        this.loadPokemonDetails(pokemonName);
      }
    });
  }

  loadPokemonDetails(pokemonName: string) {
    this.pokeApiService.getPokemonDetails(pokemonName).subscribe(
      (data: any) => {
        this.pokemon = data;
        this.extractSpriteUrls();
        this.loadAdjacentPokemon(this.pokemon.id);
      },
      error => {
        console.error('Error fetching Pokemon details:', error);
      }
    );
  }

  extractSpriteUrls() {
    const sprites = this.pokemon.sprites;
    for (const [key, value] of Object.entries(sprites)) {
      if (typeof value === 'string') {
        this.spriteUrls.push(value as string);
      }
    }
  }

  loadAdjacentPokemon(currentId: number) {
    if (currentId > 1) {
      this.pokeApiService.getPokemonDetails(String(currentId - 1)).subscribe(
        (data: any) => {
          this.prevPokemon = {
            name: data.name,
            imageUrl: data.sprites.front_default
          };
        }
      );
    }
    this.pokeApiService.getPokemonDetails(String(currentId + 1)).subscribe(
      (data: any) => {
        this.nextPokemon = {
          name: data.name,
          imageUrl: data.sprites.front_default
        };
      },
      () => this.nextPokemon = null
    );
  }

  goBack() {
    this.router.navigate(['/']);
  }

  goToPokemon(pokemon: AdjacentPokemon | null) {
    this.spriteUrls = [];
    if (pokemon) {
      this.router.navigate(['/pokemon', pokemon.name]);
    }
  }

}
