import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Post {
  id: number;
  title: string;
}

interface Query {
  postsOf: Post[];
}

@Component({
  selector: 'author-page',
  template: `
    <ul>
      @for (post of posts | async; track post.id) {
        <li>
          {{ post.title }}
        </li>
      }
    </ul>
    <a routerLink="/posts">Back to posts</a>
  `,
})
export class AuthorPageComponent implements OnInit {
  posts!: Observable<Post[]>;

  constructor(
    private readonly apollo: Apollo,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.posts = this.apollo
      .watchQuery<
        Query,
        {
          authorId: number;
        }
      >({
        query: gql`
          query authorPosts($authorId: Int) {
            postsOf(authorId: $authorId) {
              id
              title
            }
          }
        `,
        variables: {
          authorId: parseInt(this.route.snapshot.paramMap.get('id') as string, 10),
        },
      })
      .valueChanges.pipe(map(result => result.data.postsOf));
  }
}
