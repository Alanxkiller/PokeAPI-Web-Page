import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonComponent } from './pokemon.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

describe('PokemonComponent', () => {
  let component: PokemonComponent;
  let fixture: ComponentFixture<PokemonComponent>;
  let mockPokemonService: jasmine.SpyObj<PokemonService>;

  beforeEach(async () => {
    mockPokemonService = jasmine.createSpyObj('PokemonService', ['getPokemonDetails', 'getPokemonSpecies', 'getAbilityDetails', 'getMoveDetails']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatExpansionModule,
      ],
      declarations: [PokemonComponent],
      providers: [
        { provide: PokemonService, useValue: mockPokemonService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => 'pikachu' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonComponent);
    component = fixture.componentInstance;

    // Mocks
    mockPokemonService.getPokemonDetails.and.returnValue(of({
      id: 4,
      name: 'Charmander',
      sprites: { front_default: 'mockUrl' },
      stats: [{ base_stat: 65, stat: { name: 'speed' } }],
      types: [{ type: { name: 'Fire' } }],
      abilities: [{ ability: { name: 'Blaze' }, is_hidden: false }],
      moves: [{ move: { name: 'Cut', url: 'mockUrl' } }],
      cries: { latest: 'mockCryUrl' }
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display pokemon name in titlecase', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('mat-card-title')?.textContent;
    expect(title).toBe('Charmander');
  });

  it('should display the correct pokemon ID', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subtitle = compiled.querySelector('mat-card-subtitle')?.textContent;
    expect(subtitle).toBe('#4');
  });

  it('should show "No images available" when no sprites are present', () => {
    component.spriteUrls = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const placeholderText = compiled.querySelector('.placeholder p')?.textContent;
    expect(placeholderText).toBe('No images available yet for this pokemon.');
  });

});
