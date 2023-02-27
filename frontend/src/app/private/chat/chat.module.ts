import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './components/dashboard/dashboard.component';

import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatIconModule} from '@angular/material/icon';
import { SelectUsersComponent } from './components/select-users/select-users.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component'; 
import { ChatRoutingModule } from './chat-routing.module';
import { PrivateModule } from '../private.module';
import { ChatSelectorComponent } from './components/chat-selector/chat-selector/chat-selector.component';
import { FindChannelComponent } from './components/find-channel/find-channel/find-channel.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateRoomComponent,
    SelectUsersComponent,
    ChatRoomComponent,
    ChatMessageComponent,
    ChatSelectorComponent,
    FindChannelComponent
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
	PrivateModule
  ]
})
export class ChatModule { }