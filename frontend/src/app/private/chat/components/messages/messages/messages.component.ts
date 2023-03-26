import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard-service/dashboard-service';
import { MessageI } from 'src/app/model/message.interface';
import { ChatService } from '../../../services/chat-service/chat.service';
import { Observable } from 'rxjs';
import { room } from 'src/app/private/game/components/game.front/game.front.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

	message: string = '';
	ChannelName: string = 'mago';

	messages: any[] = [
		{username: 'mago', text:'salutgjhlwregharhglarghlhsagbhlrshaglaghaliughlaghlakrsghlriaugthlriaughlaiughrli giu liuhalufghal l tliuhtglaiuwhg l;g luahgluaglhag lhg lauhgluhtal l luhl khl hlahleauth lkajhglkgjeh lskgh l;rhg'},
		{username: 'mago', text:'salutgjhlwregharhglarghlhsagbhlrshaglaghaliughlaghlakrsghlriaugthlriaughlaiughrli giu liuhalufghal l tliuhtglaiuwhg l;g luahgluaglhag lhg lauhgluhtal l luhl khl hlahleauth lkajhglkgjeh lskgh l;rhg leudihglagh glirsa ghlrsuahglrashglkuharl;oigujhj lsrghjsl;ogjh; sohj; ldjsgh;losjhg;olikltds jh;lkdtj;hlsdetj;oihjtsdel;goh ijteds;lohijdt;oijkghd;lkihj;tedosikhj;todskjh ;dxkjjh ;sedtikohj; tsdlkh j;dothktj;tlkhjd;etlkhj ;teslhj;diytjh;sedtolihj ;dolitkh j;odshj ;dlk hj;lkdyhj t;lshj ;seoihjty; shjtse;lhgjset;l hkgnjsdlknj'}
	];

	messages$: Observable<MessageI[]>= this.chatService.getMessages();

	isEditing = false;
	placeholderText: string;
	placeTmp: string;
	inputText: string;

	@ViewChild('messageList') messageList: ElementRef;
	@ViewChild('inputElement') inputElementRef: ElementRef;


  constructor(private formBuilder: FormBuilder, public dashService: DashboardService, private changeDetector: ChangeDetectorRef, private elementRef: ElementRef, private chatService: ChatService) {   for (let i = 1; i <= 20; i++) {
    const username = 'User' + i;
    const text = 'Message ' + i;
    const message = {username: username, text: text};
    this.messages.push(message);
	}

	this.placeholderText = this.ChannelName;
	//this.placeTmp = this.placeholderText;
    this.inputText = "";
  }

  @HostListener('document:click', ['$event'])
	onClick(event: MouseEvent) {
		if (!this.dashService.addUsers && this.elementRef.nativeElement.querySelector('.enableAddUser').contains(event.target)) {
			this.dashService.addUsers = true;
		}
		else if (this.dashService.addUsers && this.elementRef.nativeElement.querySelector('.addUser') && !this.elementRef.nativeElement.querySelector('.addUser').contains(event.target)) {
			this.dashService.addUsers = false;
		}
	}

  ngOnInit(): void {
	setTimeout(() => {
        this.scrollToBottom();
      });
  }

  ngAfterViewInit(): void {
    this.ajusterLargeurInput(this.inputElementRef.nativeElement, null);
  }

  addUserEnable() {
	this.dashService.addUsers = true;
  }

  onSubmit() {

	this.chatService.sendMessage({text: this.message, room: this.chatService.selectedRoom});
	console.log(this.message, 'ID', this.chatService.selectedRoom.id);
	this.message = '';
  }

  scrollToBottom(): void {
    this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
  }

  members() {
	this.dashService.members = !this.dashService.members;
  }

  onFocus(): void {
    this.inputText = this.placeholderText;
	this.placeTmp = this.placeholderText;
	this.placeholderText = '';
    this.changeDetector.detectChanges();
  }

  validerPlaceholder(inputElement: HTMLInputElement): void {
	this.placeholderText = this.placeTmp;
	const tmp : string = this.inputText.trim();
    if ( tmp !== '' && tmp != this.placeholderText ) {
      this.placeholderText = this.inputText;

	  this.ChannelName = this.placeholderText;
	  console.log(this.ChannelName);
    }
	this.ajusterLargeurInput(inputElement, this.placeholderText);
    this.inputText = "";
	this.changeDetector.detectChanges();
  }

  validerPlaceholderEnter(inputElement: HTMLInputElement): void {
	inputElement.blur();
  }

  onInput(inputElement: HTMLInputElement): void {
	this.ajusterLargeurInput(inputElement, this.inputText);
  }

  ajusterLargeurInput(inputElement: HTMLInputElement, text: string): void {
	// Créez un élément span temporaire pour mesurer la largeur du texte
	const span = document.createElement('span');2
	span.style.position = 'absolute';
	span.style.visibility = 'hidden';
	span.style.whiteSpace = 'pre';
	// span.textContent = inputElement.placeholder;
	span.textContent = text || inputElement.placeholder;
  
	// Copiez les propriétés de style pertinentes de l'input vers le span
	const inputStyle = getComputedStyle(inputElement);
	const propertiesToCopy = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing'];
	for (const property of propertiesToCopy) {
	  span.style[property] = inputStyle[property];
	}
  
	// Ajoutez le span au DOM, mesurez sa largeur et retirez-le du DOM
	document.body.appendChild(span);
	const textWidth = span.getBoundingClientRect().width;
	document.body.removeChild(span);
  
	// Ajoutez un peu d'espace supplémentaire pour éviter que le texte ne soit coupé
	const padding = 0;
  
	// Définissez la largeur de l'input en fonction de la largeur du texte mesurée
	inputElement.style.width = `${textWidth + padding}px`;
  }

}
