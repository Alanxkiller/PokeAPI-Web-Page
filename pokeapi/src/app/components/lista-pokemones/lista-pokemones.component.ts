import { Component, OnInit  } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-lista-pokemones',
  templateUrl: './lista-pokemones.component.html',
  styleUrl: './lista-pokemones.component.css',
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-15px)' }),
          stagger('50ms', animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' })))
        ], { optional: true })
      ])
    ])
  ]
})

export class ListaPokemonesComponent implements OnInit {

  pokemonList: any[] = [];
  filteredPokemonList: any[] = [];
  displayedPokemonList: any[] = [];
  totalPokemons: number = 0;
  pageSize: number = 20;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  searchControl = new FormControl('');
  currentPage = 0;
  isLoading: boolean = true;

  constructor(
    private pokeApiService: PokemonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAllPokemons();
    this.setupSearch();
  }

  setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentPage = 0;
      this.updateFilteredList();
      this.updateDisplayedPokemons();
    });
  }

  

  updateFilteredList() {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    this.filteredPokemonList = this.pokemonList.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm)
    );
    this.totalPokemons = this.filteredPokemonList.length;
    this.loadPokemonImages(this.getPagedPokemons());
  }

  updateDisplayedPokemons() {
    const startIndex = this.currentPage * this.pageSize;
    this.displayedPokemonList = [];
    setTimeout(() => {
      this.displayedPokemonList = this.filteredPokemonList.slice(startIndex, startIndex + this.pageSize);
      this.loadPokemonImages(this.displayedPokemonList);
    }, 0);
  }

  getPagedPokemons(): any[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.filteredPokemonList.slice(startIndex, startIndex + this.pageSize);
  }

  loadPokemonImages(pokemons: any[]) {
    const observables: Observable<any>[] = pokemons.map(pokemon => 
      this.pokeApiService.getPokemonDetails(pokemon.name)
    );

    forkJoin(observables).subscribe(
      details => {
        details.forEach((detail, index) => {
          pokemons[index].imageUrl = detail.sprites.front_default;
        });
        this.isLoading = false; 
      },
      error => {
        console.error('Error fetching Pokemon details:', error);
        this.isLoading = false;
      }
    );
  }

  loadAllPokemons() {
    this.isLoading = true; // Indicamos que la carga ha comenzado
    this.pokeApiService.getPokemonList(100000, 0).subscribe(
      (data: any) => {
        this.pokemonList = data.results;
        this.totalPokemons = data.count;
        this.loadPokemonImages(this.pokemonList.slice(0, this.pageSize));
        this.updateFilteredList();
        this.updateDisplayedPokemons();
      },
      error => {
        console.error('Error fetching Pokemon list:', error);
        this.isLoading = false; // Aseguramos que isLoading se establezca en false incluso si hay un error
      }
    );
  }
  
  filterPokemons(searchTerm: string | null) {
    if (!searchTerm) {
      this.filteredPokemonList = [...this.pokemonList];
    } else {
      this.filteredPokemonList = this.pokemonList.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }
  
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedPokemons();
  }

  onPokemonClick(pokemonName: string) {
    this.router.navigate(['/pokemon', pokemonName]);
  }
}

