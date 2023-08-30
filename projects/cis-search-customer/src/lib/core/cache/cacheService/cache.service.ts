import { Injectable } from '@angular/core';
import * as NodeCache from 'node-cache';
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: NodeCache;
  constructor() {
    this.cache = new NodeCache();
  }

  set(key: string, value: any, ttl: number): void {
    this.cache.set(key, value, ttl);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  delete(key: string): boolean {
    return Boolean(this.cache.del(key));
  }

  clear(): void {
    this.cache.flushAll();
  }

  subscribeToChanges(key: string, callback: (value: any) => void): void {
    setInterval(() => {
      const value = this.cache.get(key);
      callback(value);
    }, 500); // Check for changes every 0.1 second
  }

  
}
