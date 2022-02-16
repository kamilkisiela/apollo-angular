import {Component, OnInit} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

interface Post {
  id: number;
  title: string;
  votes: number;
  author: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface Query {
  posts: Post[];
}

@Component({
  selector: 'posts-page',
  template: `
    <ul>
      <li *ngFor="let post of posts | async">
        {{ post.title }} by
        <a [routerLink]="['/author', post.author.id]"
          >{{ post.author.firstName }} {{ post.author.lastName }}</a
        >
        ({{ post.votes }} votes)
        <app-upvoter [postId]="post.id"></app-upvoter>
      </li>
    </ul>
  `,
})
export class PostsPageComponent implements OnInit {
  posts: Observable<Post[]>;
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.posts = this.apollo
      .watchQuery<Query>({
        query: gql`
          query allPosts {
            posts {
              id
              title
              votes
              author {
                id
                firstName
                lastName
              }
            }
          }
        `,
      })
      .valueChanges.pipe(map((result) => result.data.posts));
  }
}
