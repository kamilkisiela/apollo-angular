import { Apollo, gql } from 'apollo-angular';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-upvoter',
  template: ` <button (click)="upvote()">Upvote</button> `,
})
export class UpvoterComponent {
  @Input() postId!: number;

  constructor(private readonly apollo: Apollo) {}

  upvote() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation upvotePost($postId: Int!) {
            upvotePost(postId: $postId) {
              id
              votes
            }
          }
        `,
        variables: {
          postId: this.postId,
        },
      })
      .subscribe();
  }
}
