import { CloudinaryIntegrationService } from './../../../../services/cloudinary-integration.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'tr-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit {

  placeForm: FormGroup;
  @Output() newPlace: EventEmitter<Object> = new EventEmitter<Object>();
  @Input() place;
  googleSuggestedPlaceName: string = null;


  constructor(private formBuilder: FormBuilder, private cloudinaryService: CloudinaryIntegrationService) {
  }

  ngOnInit() {
    if(this.place) {
      this.placeForm = this.formBuilder.group({
        'id': [this.place.id, Validators.required],
        'name': [this.place.name, Validators.required],
        'review': [this.place.review],
        'pictures': this.formBuilder.array(this.place.pictures),
        '_destroy': [this.place._destroy]
      })
    }
    else {
      this.placeForm = this.formBuilder.group({
        'name': ['', Validators.required],
        'review': [''],
        'pictures': this.formBuilder.array([]),
        '_destroy': [false]
      })
    }

  }

  imageUploaded(image) {
    (<FormArray>this.placeForm.controls['pictures']).push(
      this.formBuilder.group(image))
  }

  removeImage(picture, index) {
    // console.log("place form", this.placeForm.value);
    (<FormGroup>(<FormArray>this.placeForm.controls['pictures']).controls[index]).setValue({
      id: picture.id,
      description: picture.description,
      url: picture.url,
      public_id: picture.public_id,
      '_destroy': true
  });
  }

  onSubmit() {
    let place = this.placeForm.value;
    if(this.googleSuggestedPlaceName)
      place.name = this.googleSuggestedPlaceName;
    this.newPlace.emit(place);

    this.placeForm.controls['name'].setValue('');
    this.placeForm.controls['review'].setValue('');
    let empty = this.formBuilder.array([]);
    this.placeForm.setControl('pictures', empty);
    this.placeForm.controls['_destroy'].setValue(false);
  }

  focusFunction($event) {
    let input = $($event.target)[0]; 
    let options = {
      types: ['establishment']
    };
    let autocomplete = new google.maps.places.Autocomplete(input);
    let that = this;
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
      let place = autocomplete.getPlace();
      that.googleSuggestedPlaceName = place.name;
    });
  }

}