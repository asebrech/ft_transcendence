import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard-service/dashboard-service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

	message: string = '';

	messages: any[] = [
		{username: 'mago', text:'salutgjhlwregharhglarghlhsagbhlrshaglaghaliughlaghlakrsghlriaugthlriaughlaiughrli giu liuhalufghal l tliuhtglaiuwhg l;g luahgluaglhag lhg lauhgluhtal l luhl khl hlahleauth lkajhglkgjeh lskgh l;rhg'},
		{username: 'mago', text:'salutgjhlwregharhglarghlhsagbhlrshaglaghaliughlaghlakrsghlriaugthlriaughlaiughrli giu liuhalufghal l tliuhtglaiuwhg l;g luahgluaglhag lhg lauhgluhtal l luhl khl hlahleauth lkajhglkgjeh lskgh l;rhg leudihglagh glirsa ghlrsuahglrashglkuharl;oigujhj lsrghjsl;ogjh; sohj; ldjsgh;losjhg;olikltds jh;lkdtj;hlsdetj;oihjtsdel;goh ijteds;lohijdt;oijkghd;lkihj;tedosikhj;todskjh ;dxkjjh ;sedtikohj; tsdlkh j;dothktj;tlkhjd;etlkhj ;teslhj;diytjh;sedtolihj ;dolitkh j;odshj ;dlk hj;lkdyhj t;lshj ;seoihjty; shjtse;lhgjset;l hkgnjsdlknj'}
	];

	name: string = 'Mago'
	isEditing = false;

	@ViewChild('messageList') messageList: ElementRef;


  constructor(private formBuilder: FormBuilder, public dashService: DashboardService) {   for (let i = 1; i <= 20; i++) {
    const username = 'User' + i;
    const text = 'Message ' + i;
    const message = {username: username, text: text};
    this.messages.push(message);
  }}

  ngOnInit(): void {
	setTimeout(() => {
        this.scrollToBottom();
      });
  }

  onSubmit() {
	console.log(this.message);
	this.message = '';
  }

  scrollToBottom(): void {
    this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
  }

  members() {
	this.dashService.members = !this.dashService.members;
  }

  updateName(event: Event) {
    const newName = (event.target as HTMLInputElement).innerText.trim();
	if (newName === '') {
		console.log('hello');
		this.name = newName;
		return; // Quitter la méthode si le nouveau nom est vide
	  }
	if (newName && this.name !== newName){
		this.name = newName;
	}
	console.log(this.name);
  }

  updateNameEnter(event: Event) {
	(event.target as HTMLInputElement).blur();
  }

  update() {}

}
