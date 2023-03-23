import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service/dashboard-service';
import { Console } from 'console';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

	imagePath1 = "../../../../../../assets/images/close.png";
	imagePath2 = "../../../../../../assets/images/arrow-down-sign-to-navigate.png";

	selectedUser: any;
	isClicked = false;
	connected: boolean = true;
	showOverlay = false;
	heightOverlay = 0;
	overlayPosition = { left: 0, top: 0 };
	selectedIndex: number | null = null;

	users = [
		{ name: 'Mago' },
		{ name: 'Ramzi' },
		{ name: 'Wanis' },
		{ name: 'Mago' },
		{ name: 'Ramzi' },
		{ name: 'Wanis' },
		{ name: 'Mago' },
		{ name: 'Ramzi' },
		{ name: 'Wanis' },
		{ name: 'Mago' },
		{ name: 'Ramzi' },
		{ name: 'Wanis' },
		{ name: 'Mago' },
		{ name: 'Ramzi' },
		{ name: 'Wanis' }
	  ];

	  @ViewChild('option') option: ElementRef;

  constructor(private elementRef: ElementRef, public dashService: DashboardService) { 
  }

  ngOnInit(): void {}

  ngOnDestroy() {
	console.log('test1');
	this.hide();
  }

  checkResize(): void {
	window.addEventListener('resize', this.onResize.bind(this));
  }

  uncheckResize() {
    // Supprimez le gestionnaire d'événements de défilement lorsque le composant est détruit
	console.log('test');
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  @HostListener('document:click', ['$event'])
	onClick(event: MouseEvent) {
	 if (this.showOverlay && this.elementRef.nativeElement.querySelector('.selected') && !this.elementRef.nativeElement.querySelector('.selected').contains(event.target)
	 	&& !this.elementRef.nativeElement.querySelector('.overlay').contains(event.target)) {
			this.hide();
		}
	}

	onValueChanged(newValue: boolean) {
		this.hide();
	  }

	divHeight(newValue: number) {
		this.heightOverlay = newValue;
	  }

  test() {
	console.log('fonctionne');
  }

  hide() {
	this.showOverlay = false;
	this.selectedUser = null;
	this.isClicked = false;
	this.uncheckResize();
  }

  getElementPosition(index: number, event: MouseEvent) {

	if (index === this.selectedIndex && this.showOverlay) {
		this.hide();
		return;
	}
    // Récupérer l'élément DOM à partir de l'événement de clic
    const domElement = event.target as HTMLElement;

    // Récupérer la position de l'élément en utilisant getBoundingClientRect()
    const rect = domElement.getBoundingClientRect();

	this.selectedIndex = index;

	this.overlayPosition.left = -260;
	
	const windowHeight = window.innerHeight;
  	const overlayHeight = this.heightOverlay + 100;//domElement.offsetHeight;

	  if (rect.top + this.heightOverlay > windowHeight) {
		this.overlayPosition.top = windowHeight - overlayHeight;
	  } else {
		this.overlayPosition.top = rect.top -95;
	  }

    // Afficher la div de 100x100
    this.showOverlay = true;
	this.checkResize();
  }

  onResize(event: Event) {
    // Vérifiez si la fenêtre est visible
	console.log('hello');
    if (this.showOverlay && this.selectedIndex !== null) {
      // Calculez la hauteur de défilement
	  const selectedElement = document.querySelector('.selected') as HTMLAnchorElement;
	  
	  const rect = selectedElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset;

      // Récupérez la hauteur de la fenêtre et la hauteur de la div
      const windowHeight = window.innerHeight;
      const overlayHeight = this.heightOverlay + 100;;

      // Ajustez la position 'top' de la div si nécessaire
      if (this.overlayPosition.top + overlayHeight > windowHeight + scrollTop) {
        this.overlayPosition.top = windowHeight - overlayHeight;
      }
	  else if (this.overlayPosition.top + 100 < rect.top) {
        this.overlayPosition.top = (windowHeight - overlayHeight);
	  }
	  else {
		this.overlayPosition.top = rect.top -95;
	  }
    }
  }

}
