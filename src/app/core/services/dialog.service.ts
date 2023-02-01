import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RepoChangeFormComponent } from '../../shared/repo-change-form/repo-change-form.component';
import { LabelDefinitionPopupComponent } from '../../shared/label-definition-popup/label-definition-popup.component';
import { UserConfirmationComponent } from '../guards/user-confirmation/user-confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openUserConfirmationModal(messages: string[], yesButtonMessage: string, noButtonMessage: string) {
    return this.dialog.open(UserConfirmationComponent, {
      data: {
        messages: messages,
        yesMessage: yesButtonMessage,
        noMessage: noButtonMessage
      }
    });
  }

  openLabelDefinitionDialog(labelName: String, labelDefinition: String) {
    return this.dialog.open(LabelDefinitionPopupComponent, {
      data: {
        header: labelName,
        body: labelDefinition
      }
    });
  }

  openChangeRepoDialog(repoName: String) {
    return this.dialog.open(RepoChangeFormComponent, {
      data: {
        repoName: repoName
      },
      height: 'auto',
      width: '40%'
    });
  }
}
