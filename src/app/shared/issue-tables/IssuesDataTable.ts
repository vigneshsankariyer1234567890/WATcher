import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { GithubUser } from '../../core/models/github-user.model';
import { Issue } from '../../core/models/issue.model';
import { DEFAULT_FILTER, Filter } from '../../core/services/filters.service';
import { IssueService } from '../../core/services/issue.service';
import { applyDropdownFilter } from './dropdownfilter';
import { FilterableSource } from './filterableTypes';
import { paginateData } from './issue-paginator';
import { applySort } from './issue-sorter';
import { applySearchFilter } from './search-filter';

export class IssuesDataTable extends DataSource<Issue> implements FilterableSource {
  public count = 0;
  private filterChange = new BehaviorSubject(DEFAULT_FILTER);
  private issuesSubject = new BehaviorSubject<Issue[]>([]);
  private issueSubscription: Subscription;

  public isLoading$ = this.issueService.isLoading.asObservable();

  constructor(
    private issueService: IssueService,
    private paginator: MatPaginator,
    private displayedColumn: string[],
    private assignee?: GithubUser,
    private defaultFilter?: (issue: Issue) => boolean
  ) {
    super();
  }

  connect(): Observable<Issue[]> {
    return this.issuesSubject.asObservable();
  }

  disconnect() {
    this.filterChange.complete();
    this.issuesSubject.complete();
    this.issueSubscription.unsubscribe();
    this.issueService.stopPollIssues();
  }

  loadIssues() {
    let page;
    if (this.paginator !== undefined) {
      page = this.paginator.page;
    }

    const displayDataChanges = [this.issueService.issues$, page, this.filterChange].filter((x) => x !== undefined);

    this.issueService.startPollIssues();
    this.issueSubscription = merge(...displayDataChanges)
      .pipe(
        // maps each change in display value to new issue ordering or filtering
        map(() => {
          let data = <Issue[]>Object.values(this.issueService.issues$.getValue()).reverse();
          if (this.defaultFilter) {
            data = data.filter(this.defaultFilter);
          }
          // Filter by assignee of issue
          if (this.assignee) {
            data = data.filter((issue) => {
              if (issue.issueOrPr === 'PullRequest') {
                return issue.author === this.assignee.login;
              } else if (!issue.assignees) {
                return false;
              } else {
                return issue.assignees.includes(this.assignee.login);
              }
            });
          } else {
            data = data.filter((issue) => {
              return issue.issueOrPr !== 'PullRequest' && issue.assignees.length === 0;
            });
          }

          // Apply Filters
          data = applyDropdownFilter(this.filter, data);

          data = applySearchFilter(this.filter.title, this.displayedColumn, this.issueService, data);
          this.count = data.length;

          data = applySort(this.filter.sort, data);

          if (this.paginator !== undefined) {
            data = paginateData(this.paginator, data);
          }
          return data;
        })
      )
      .subscribe((issues) => {
        this.issuesSubject.next(issues);
      });
  }

  get filter(): Filter {
    return this.filterChange.value;
  }

  set filter(filter: Filter) {
    this.filterChange.next(filter);
  }
}
