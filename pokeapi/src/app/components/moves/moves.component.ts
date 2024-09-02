import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { forkJoin, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-moves',
  templateUrl: './moves.component.html',
  styleUrl: './moves.component.css'
})
export class MovesComponent implements OnInit {

  pokemon: any;
  moves: Move[] = [];
  moveTypes: string[] = [];
  filteredMoves: Move[] = [];
  selectedType: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokeApiService: PokemonService
  ) {}

  ngOnInit() {
    this.loadAllMoves();
    this.loadMoveTypes();
  }

  loadAllMoves() {
    this.pokeApiService.getAllMoves().subscribe(
      (response: any) => {
        const moveObservables = response.results.map((move: any) =>
          this.pokeApiService.getMoveDetails(move.url)
        );

        forkJoin(moveObservables as Observable<any>[]).subscribe(
          (moveDetails: any[]) => {
            this.moves = moveDetails.map((detail) => ({
              name: detail.name,
              type: detail.type.name,
              category: detail.damage_class.name,
              power: detail.power,
              accuracy: detail.accuracy,
              pp: detail.pp,
              effect: this.getEnglishEffectEntry(detail.effect_entries),
              effectChance: detail.effect_chance,
            }));
            this.filterMovesByType(); // Aplica el filtro después de cargar los movimientos
          },
          (error) => {
            console.error('Error fetching move details:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching moves:', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/']);
  }

  filterMovesByType() {
    if (this.selectedType) {
      this.filteredMoves = this.moves.filter(move => move.type === this.selectedType);
    } else {
      this.filteredMoves = this.moves;
    }
  }

  onTypeChange(type: string) {
    this.selectedType = type;
    this.filterMovesByType(); // Filtra cuando se cambia el tipo
  }

  loadMoveDetails() {
    const moveObservables = this.pokemon.moves.map((move: any) =>
      this.pokeApiService.getMoveDetails(move.move.url)
    );

    forkJoin(moveObservables as Observable<any>[]).subscribe(
      (moveDetails: any[]) => {
        this.moves = moveDetails.map((detail) => ({
          name: detail.name,
          type: detail.type.name,
          category: detail.damage_class.name,
          power: detail.power,
          accuracy: detail.accuracy,
          pp: detail.pp,
          effect: this.getEnglishEffectEntry(detail.effect_entries),
          effectChance: detail.effect_chance,
        }));
      },
      (error) => {
        console.error('Error fetching move details:', error);
      }
    );
  }

  loadMoveTypes() {
    this.pokeApiService.getMoveTypes().subscribe(
      (data: any) => {
        this.moveTypes = data.results.map((move: any) => move.name);
      },
      (error) => {
        console.error('Error fetching move types:', error);
      }
    );
  }

  getEnglishEffectEntry(effectEntries: any[]): string {
    const englishEntry = effectEntries.find(
      (entry) => entry.language.name === 'en'
    );
    return englishEntry ? englishEntry.effect : 'No description available.';
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
      fairy: '#F0B6BC',
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
      fairy: '#8D6B6E',
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
