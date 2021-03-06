import { Component, Inject, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { BookingForm } from './booking-form.model';
import { Http, ApiUrl } from 'core/rest';

@Component({
    selector: 'tm-booking-form-overlay',
    templateUrl: 'form-overlay.component.html',
})
export class BookingFormOverlayComponent {
    @ViewChild('viewerTpl')
    viewerTemplate: TemplateRef<any>;

    reissueApi: ApiUrl;

    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        private positionBuilder: OverlayPositionBuilder,
        private http: Http,
        @Inject('BOOKING_API_URL')
        reissueApiUrl: string,
    ) {
        this.reissueApi = new ApiUrl(reissueApiUrl);
    }

    show(formId: number) {
        this.http.get<any>(this.reissueApi.item(formId)).subscribe(dto => {
            const form = new BookingForm(dto);

            const overlayRef = this.overlay.create({
                positionStrategy: this.positionBuilder.global().top('0').right('0'),
                width: '600px',
                height: '100%',
                hasBackdrop: true,
                panelClass: 'bg-white',
            });

            const close = () => {
                overlayRef.detach();
            };

            const viewerPortal = new TemplatePortal(this.viewerTemplate, this.viewContainerRef, {
                form: form,
                close: close,
            });
            overlayRef.attach(viewerPortal);
            overlayRef.backdropClick().subscribe(close);
        });
    }
}
