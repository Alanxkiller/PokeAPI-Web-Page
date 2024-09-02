import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getPokemonList(limit: number = 20, offset: number = 0): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetails(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon/${name}`);
  }

  getAllPokemon(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon?limit=1000`); // Ajusta el límite según sea necesario
  }

  getAbilityDetails(url: string): Observable<any> {
    return this.http.get(url);
  }

  getMoveDetails(url: string): Observable<any> {
    return this.http.get(url);
  }

  getPokemonSpecies(pokemonId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon-species/${pokemonId}`);
  }

  getAllMoves(limit: number = 2000, offset: number = 0): Observable<any> {
    return this.http.get(`${this.baseUrl}/move?limit=${limit}&offset=${offset}`);
  }

  getMoveTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/type`);
  }

}
