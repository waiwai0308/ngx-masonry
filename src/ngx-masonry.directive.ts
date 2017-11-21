import {
	Directive,
	Inject,
	ElementRef,
	forwardRef,
	OnDestroy,
	AfterViewInit
} from '@angular/core';

import { NgxMasonryComponent } from './ngx-masonry.component';

interface MutationWindow extends Window {
	MutationObserver: any;
	WebKitMutationObserver: any;
}

declare var window: MutationWindow;

@Directive({
	selector: '[ngx-masonry-item], ngx-masonry-item'
})
export class NgxMasonryDirective implements OnDestroy, AfterViewInit {
	constructor(
		private _element: ElementRef,
		@Inject(forwardRef(() => NgxMasonryComponent))
		private _parent: NgxMasonryComponent
	) {}

	ngAfterViewInit() {
		this._parent.add(this._element.nativeElement);
		this.watchForHtmlChanges();
	}

	ngOnDestroy() {
		this._parent.remove(this._element.nativeElement);
	}

	/** When HTML in brick changes dinamically, observe that and change layout */
	private watchForHtmlChanges(): void {
		MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

		if (MutationObserver) {
			/** Watch for any changes to subtree */
			let self = this;
			let observer = new MutationObserver(function(
				mutations,
				observerFromElement
			) {
				self._parent.layout();
			});

			// define what element should be observed by the observer
			// and what types of mutations trigger the callback
			observer.observe(this._element.nativeElement, {
				subtree: true,
				childList: true
			});
		}
	}
}