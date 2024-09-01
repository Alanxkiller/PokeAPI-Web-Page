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
  showStats: boolean = false;


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
        this.calculateStatPercentages();
        setTimeout(() => {
          this.showStats = true;
        }, 100);
      },
      error => {
        console.error('Error fetching Pokemon details:', error);
      }
    );
  }

  calculateStatPercentages() {
    this.pokemon.stats.forEach((stat: any) => {
      stat.percentage = (stat.base_stat / 255) * 100;
    });
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

  getStatColor(baseStat: number): string {
    const maxStat = 600;
    const midStat = maxStat / 2;
    let color: string;
  
    if (baseStat <= midStat) {
      // De rojo a amarillo
      const ratio = baseStat / midStat;
      const red = Math.round(255 * (1 - ratio));
      const yellow = Math.round(255 * ratio);
      color = `rgb(${red+20}, ${yellow+50}, 0)`; // Rojo a amarillo
    } else {
      // De amarillo a verde
      const ratio = (baseStat - midStat) / (maxStat - midStat);
      const green = Math.round(255 * ratio);
      const yellow = Math.round(255 * (1 - ratio));
      color = `rgb(${yellow+20}, ${green+50}, 0)`; // Amarillo a verde
    }
    return color;
  }

  getTypeColor(typeName: string): string {
    const typeColors: { [key: string]: string } = {
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#F0B6BC'
    };
  
    return typeColors[typeName.toLowerCase()] || '#A7A7A7'; // Devuelve gris por defecto si no se encuentra el tipo
  }

}
