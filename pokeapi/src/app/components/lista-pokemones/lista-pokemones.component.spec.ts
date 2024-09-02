import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ListaPokemonesComponent } from './lista-pokemones.component';
import { PokemonService } from '../../services/pokemon.service';
import { of } from 'rxjs';

describe('ListaPokemonesComponent', () => {
  let component: ListaPokemonesComponent;
  let fixture: ComponentFixture<ListaPokemonesComponent>;
  let pokemonService: jasmine.SpyObj<PokemonService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PokemonService', ['getPokemonList', 'getPokemonDetails']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        MatGridListModule,
        MatCardModule,
        BrowserAnimationsModule
      ],
      declarations: [ListaPokemonesComponent],
      providers: [{ provide: PokemonService, useValue: spy }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaPokemonesComponent);
    component = fixture.componentInstance;
    pokemonService = TestBed.inject(PokemonService) as jasmine.SpyObj<PokemonService>;

    // Datos para pruebas nadamas
    pokemonService.getPokemonList.and.returnValue(of({ results: [], count: 0 }));
    pokemonService.getPokemonDetails.and.returnValue(of({ sprites: { front_default: '' } }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update filteredPokemonList based on search term', () => {
    const mockPokemons = [
      { name: 'Pikachu' },
      { name: 'Bulbasaur' },
      { name: 'Charmander' }
    ];
  
    component.pokemonList = mockPokemons;
    component.searchControl.setValue('Pikachu');
  
    component.updateFilteredList();
    fixture.detectChanges();
  
    expect(component.filteredPokemonList.length).toBe(1);
    expect(component.filteredPokemonList[0].name).toBe('Pikachu');
  });

  it('should update pokemon images', () => {
    const mockPokemons = [{ name: 'Pikachu', imageUrl: '' }];
    const mockDetails = { sprites: { front_default: 'pikachu.png' } };
  
    pokemonService.getPokemonDetails.and.returnValue(of(mockDetails));
  
    component.loadPokemonImages(mockPokemons);
    fixture.detectChanges();
  
    expect(mockPokemons[0].imageUrl).toBe('pikachu.png');
  });

});
