import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-check-pass',
  templateUrl: './check-pass.component.html',
  styleUrls: ['./check-pass.component.scss']
})
export class CheckPassComponent implements OnInit {

	message: string = '';


  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

  onSubmit() {
	if (this.message) {
		this.chatService.checkPass(this.message);
		this.message = '';
	}
  }
}
