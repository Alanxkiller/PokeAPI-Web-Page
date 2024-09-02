import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a list of Pokémon from the API via GET', () => {
    const dummyPokemonList = { results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }] };
  
    service.getPokemonList(2, 0).subscribe(pokemon => {
      expect(pokemon.results.length).toBe(2);
      expect(pokemon.results).toEqual(dummyPokemonList.results);
    });
  
    const req = httpMock.expectOne(`${service.baseUrl}/pokemon?limit=2&offset=0`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPokemonList);
  });

  it('should retrieve Pokémon details by name from the API via GET', () => {
    const dummyPokemonDetails = { name: 'bulbasaur', id: 1 };
  
    service.getPokemonDetails('bulbasaur').subscribe(pokemon => {
      expect(pokemon).toEqual(dummyPokemonDetails);
    });
  
    const req = httpMock.expectOne(`${service.baseUrl}/pokemon/bulbasaur`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPokemonDetails);
  });

  it('should retrieve a list of all moves from the API via GET', () => {
    const dummyMovesList = { results: [{ name: 'pound' }, { name: 'karate chop' }] };
  
    service.getAllMoves().subscribe(moves => {
      expect(moves.results.length).toBe(2);
      expect(moves.results).toEqual(dummyMovesList.results);
    });
  
    const req = httpMock.expectOne(`${service.baseUrl}/move?limit=2000&offset=0`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMovesList);
  });

  it('should handle HTTP errors nicely', () => {
    const errorMessage = '404 error';
  
    service.getPokemonDetails('unknown').subscribe(
      data => fail('should have failed with 404 error'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );
  
    const req = httpMock.expectOne(`${service.baseUrl}/pokemon/unknown`);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
