import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { forkJoin, Observable } from 'rxjs';

interface AdjacentPokemon {
  name: string;
  imageUrl: string;
}

interface Ability {
  name: string;
  effect: string;
  isHidden: boolean;
}

interface Move {
  name: string;
  type: string;
  category: string;
  power: number;
  accuracy: number;
  pp: number;
  effect: string;
  effectChance?: number;
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
  abilities: Ability[] = [];
  moves: Move[] = [];
  flavorText: string = '';
  cryAudioLatest: HTMLAudioElement | null = null;
  cryAudioLegacy: HTMLAudioElement | null = null;
  
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
        this.loadAbilityDetails();
        this.loadMoveDetails();
        this.loadSpeciesInfo(this.pokemon.id);

        const audioUrlLatest = data.cries.latest;
        this.cryAudioLatest = new Audio(audioUrlLatest);
        this.cryAudioLatest.volume = 0.5;
  
        const audioUrlLegacy = data.cries.legacy;
        this.cryAudioLegacy = new Audio(audioUrlLegacy);
        this.cryAudioLegacy.volume = 0.5;

        setTimeout(() => {
          this.showStats = true;
        }, 100);
      },
      error => {
        console.error('Error fetching Pokemon details:', error);
      }
    );
  }

  loadSpeciesInfo(pokemonId: number) {
    this.pokeApiService.getPokemonSpecies(pokemonId).subscribe(
      (data: any) => {
        const englishFlavorText = data.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'en'
        );
        this.flavorText = englishFlavorText ? englishFlavorText.flavor_text : 'No description available.';
      },
      error => {
        console.error('Error fetching species info:', error);
      }
    );
  }

  playCryLatest() {
    if (this.cryAudioLatest) {
      this.cryAudioLatest.play();
    }
  }

  playCryLegacy() {
    if (this.cryAudioLegacy) {
      this.cryAudioLegacy.play();
    }
  }

  loadMoveDetails() {
    const moveObservables = this.pokemon.moves.map((move: any) =>
      this.pokeApiService.getMoveDetails(move.move.url)
    );

    forkJoin(moveObservables as Observable<any>[]).subscribe(
      (moveDetails: any[]) => {
        this.moves = moveDetails.map(detail => ({
          name: detail.name,
          type: detail.type.name,
          category: detail.damage_class.name,
          power: detail.power,
          accuracy: detail.accuracy,
          pp: detail.pp,
          effect: this.getEnglishEffectEntry(detail.effect_entries),
          effectChance: detail.effect_chance
        }));
      },
      error => {
        console.error('Error fetching move details:', error);
      }
    );
  }

  getEnglishEffectEntry(effectEntries: any[]): string {
    const englishEntry = effectEntries.find(entry => entry.language.name === 'en');
    return englishEntry ? englishEntry.effect : 'No description available.';
  }

  loadAbilityDetails() {
    const abilityObservables = this.pokemon.abilities.map((ability: any) =>
      this.pokeApiService.getAbilityDetails(ability.ability.url)
    );

    forkJoin(abilityObservables as Observable<any>[]).subscribe(
      (abilityDetails: any[]) => {
        this.abilities = abilityDetails.map((detail, index) => ({
          name: this.pokemon.abilities[index].ability.name,
          effect: this.getEnglishFlavorText(detail.flavor_text_entries),
          isHidden: this.pokemon.abilities[index].is_hidden
        }));
      },
      error => {
        console.error('Error fetching ability details:', error);
      }
    );
  }

  getEnglishFlavorText(flavorTextEntries: any[]): string {
    const englishEntry = flavorTextEntries.find(entry => entry.language.name === 'en');
    return englishEntry ? englishEntry.flavor_text : 'No description available.';
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

  getBorderTypeColor(typeName: string): string {
    const typeColors: { [key: string]: string } = {
      fire: '#8D4C20',
      water: '#3D558D',
      grass: '#45732E',
      electric: '#8D761B',
      ice: '#638D8D',
      fighting: '#731E18',
      poison: '#732E73',
      ground: '#8D7941',
      flying: '#63548D',
      psychic: '#8D2C4C',
      bug: '#6A7314',
      rock: '#806E26',
      ghost: '#392D4D',
      dragon: '#41208D',
      dark: '#382C24',
      steel: '#7C7C8D',
      fairy: '#8D6B6E'
    };
  
    return typeColors[typeName.toLowerCase()] || '#5A5A5A'; // Devuelve gris por defecto si no se encuentra el tipo
  }

  getCategoryColor(categoryName: string): string {
    const typeColors: { [key: string]: string } = {
      physical: '#FF8A30',
      special: '#2858F6',
      status: '#A7A7A7',
    };
  
    return typeColors[categoryName.toLowerCase()] || '#A7A7A7'; // Devuelve gris por defecto si no se encuentra el tipo
  }

  getCategoryTypeColor(categoryName: string): string {
    const typeColors: { [key: string]: string } = {
      physical: '#8D4C1B',
      special: '#17328D',
      status: '#5A5A5A',
    };
  
    return typeColors[categoryName.toLowerCase()] || '#5A5A5A'; // Devuelve gris por defecto si no se encuentra el tipo
  }

}
