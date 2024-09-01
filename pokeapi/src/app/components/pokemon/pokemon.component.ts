import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})
export class PokemonComponent implements OnInit {
  pokemon: any;
  spriteUrls: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokeApiService: PokemonService
  ) { }

  ngOnInit() {
    const pokemonName = this.route.snapshot.paramMap.get('name');
    if (pokemonName) {
      this.pokeApiService.getPokemonDetails(pokemonName).subscribe(
        (data: any) => {
          this.pokemon = data;
          this.extractSpriteUrls();
        },
        error => {
          console.error('Error fetching Pokemon details:', error);
        }
      );
    }
  }

  extractSpriteUrls() {
    const sprites = this.pokemon.sprites;
    for (const [key, value] of Object.entries(sprites)) {
      if (typeof value === 'string') {
        this.spriteUrls.push(value as string);
      }
    }
  }

}
