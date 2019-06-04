import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss']
})
export class NewOfferPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    console.log('Form: ', form);
  }

  onCreateOffer() {
    console.log('Create!');
  }
}
