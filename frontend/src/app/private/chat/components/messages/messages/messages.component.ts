import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

	@ViewChild('messageList') messageList: ElementRef;


  constructor(private formBuilder: FormBuilder) {   for (let i = 1; i <= 20; i++) {
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

}
