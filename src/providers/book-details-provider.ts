import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BookDetail} from '../common/types';

@Injectable()
export class BookDetailsProvider {

  constructor(public http: HttpClient) {}

  getBookDetails(isbn: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
        .subscribe(
          (response: any) => {
            if (response.totalItems > 0) {
              const selfUrl = response.items[0]['selfLink'];
              this.http.get(selfUrl)
                .subscribe(book => {
                  const item: BookDetail = {
                    title: book['volumeInfo']['title'],
                    authors: book['volumeInfo']['authors'].join(', '),
                    publisher: book['volumeInfo']['publisher'],
                    publishedDate: book['volumeInfo']['publishedDate'],
                    description: book['volumeInfo']['description'],
                    pageCount: book['volumeInfo']['pageCount'],
                    language: book['volumeInfo']['language']
                  };
                  resolve(item);
                });
            } else {
              resolve(undefined);
            }
          },
          (error) => {
            reject(error);
          }
        );
    });
  }


}
