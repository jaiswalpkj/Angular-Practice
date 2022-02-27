import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Post } from '../model/post.model';
import { PostService } from '../posts/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(
    public postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {}
  posts: Post[];
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postSubscription: Subscription;
  private isUserAuthenticatedSubs: Subscription;
  public userIsAuthenticated: boolean = false;
  public userId: string;

  ngOnInit() {
    this.isLoading = true;
    this.posts = [];
    this.postService.getPost(this.postPerPage, this.currentPage);
    this.postSubscription = this.postService
      .getUpdatedPostListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.userIsAuthenticated = this.authService.getIsUserAuthenticated();
    this.isUserAuthenticatedSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.userId = this.authService.getUserId();
  }
  onPostDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(
      () => {
        this.postService.getPost(this.postPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPost(this.postPerPage, this.currentPage);
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
    this.isUserAuthenticatedSubs.unsubscribe();
  }
}
