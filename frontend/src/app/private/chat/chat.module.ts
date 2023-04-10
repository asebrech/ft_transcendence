import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './components/dashboard/dashboard.component';

import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatIconModule} from '@angular/material/icon';
import { SelectUsersComponent } from './components/select-users/select-users.component';
import { ChatRoutingModule } from './chat-routing.module';
import { PrivateModule } from '../private.module';
import { FindChannelComponent } from './components/find-channel/find-channel.component';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ChannelOptionComponent } from './components/channel-option/channel-option.component';
import { MembersListComponent } from './components/members-list/members-list.component';
import { MemberOptionComponent } from './components/member-option/member-option.component';
import { AddUsersComponent } from './components/add-users/add-users.component';
import { CreateChannelComponent } from './components/create-channel/create-channel.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SelectUsersComponent,
    FindChannelComponent,
	CreateChannelComponent,
    ConversationListComponent,
    MessagesComponent,
	ChannelOptionComponent,
 MembersListComponent,
 MemberOptionComponent,
 AddUsersComponent
  ],
  imports: [
    CommonModule,
	ChatRoutingModule,
	MatListModule,
	MatPaginatorModule,
	MatCardModule,
	MatButtonModule,
	ReactiveFormsModule,
	MatFormFieldModule,
	MatInputModule,
	MatChipsModule,
	MatAutocompleteModule,
	MatIconModule,
	PrivateModule,
	FormsModule
  ]
})
export class ChatModule { }