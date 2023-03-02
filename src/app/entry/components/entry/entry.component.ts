import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

import { map, Subscription, BehaviorSubject } from 'rxjs';
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';

import { EntryService } from '../../services/entry.service';
import { EntryFactory } from '../../services/entry.factory';
import { Entry, Meaning } from '../../models/entry';
import { EntryForm, FormMeaning, entryPropertiesValidationValues } from '../../models/entry-form';
import { ButtonState } from 'src/app/shared/config/components/button';
import { TextInputState } from 'src/app/shared/config/components/text-input';
import { assert } from 'src/app/shared/utils/assert/assert';
import { navigationPaths } from 'src/app/shared/config/navigation-paths/navigation-paths';
import { onlyWhiteSpacesPreventionValidator } from 'src/app/shared/services/form/form-control-validators';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  faXmarkCircle = faXmarkCircle;

  ButtonState = ButtonState;
  TextInputState = TextInputState;

  entryPropertiesValidationValues = entryPropertiesValidationValues;

  constructor(
    private entryService: EntryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private entryFactory: EntryFactory
  ) { }

  ngOnInit(): void {
    this.subscribeToActivatedRouteEntryData();
    this.createEntryForm();
  }

  private subscribeToActivatedRouteEntryData(): void {
    this.entrySubscription = this.activatedRoute.data
      .pipe(
        map(data => data['entry']),
      )
      .subscribe((entry: Entry) => this.entry = entry);
  }

  private entrySubscription!: Subscription;
  entry!: Entry;
  isEntryChanged: boolean = false;

  private createEntryForm(): void {
    this.entryForm = this.formBuilder.nonNullable.group({
      newWord: [
        { value: '', disabled: this.isNewWordFormControlShouldBeDisabled },
        [
          onlyWhiteSpacesPreventionValidator,
          Validators.minLength(this.entryPropertiesValidationValues.wordMinLength),
          Validators.maxLength(this.entryPropertiesValidationValues.wordMaxLength),
        ]
      ],
      meanings: this.formBuilder.nonNullable.control<{ [index: number]: FormMeaning }>({})
    },
    );
  }

  entryForm!: EntryForm;

  get isNewWordFormControlShouldBeDisabled(): boolean {
    return this.entry.words.length === this.entryPropertiesValidationValues.wordsMaxLength
  }

  addNewWord(): void {
    assert(this.entry.words.length < this.entryPropertiesValidationValues.wordsMaxLength,
      `The entry's words contains ${this.entry.words.length} items while the allowable value is ${this.entryPropertiesValidationValues.wordsMaxLength}`);
    assert(this.entryForm.controls.newWord.valid, 'The new word form control is invalid');

    this.entry.words.push(this.entryForm.controls.newWord.value.trim());
    this.isEntryChanged = true;
    this.entryForm.controls.newWord.reset();
    if (this.entry.words.length === 1) {
      this.updateNewWordTextInputStatus('', TextInputState.default);
    }
    if (this.isNewWordFormControlShouldBeDisabled) {
      this.entryForm.controls.newWord.disable({ onlySelf: true });
    }
  }

  private updateNewWordTextInputStatus(message: string, state: TextInputState): void {
    this.newWordTextInputMessage$.next(message);
    this.newWordTextInputState$.next(state);
  }

  newWordTextInputMessage$ = new BehaviorSubject<string>('');
  newWordTextInputState$ = new BehaviorSubject<TextInputState>(TextInputState.default);

  get isAddWordButtonDisabled(): boolean {
    return !this.entryForm.controls.newWord.valid ||
      this.entryForm.controls.newWord.disabled;
  }

  deleteWord(index: number): void {
    assert(this.entry.words[index] !== undefined,
      `There is no word at the ${index} index`);

    this.entry.words.splice(index, 1);
    this.isEntryChanged = true;
    if (this.entry.words.length === entryPropertiesValidationValues.wordsMaxLength - 1) {
      this.entryForm.controls.newWord.enable();
    }
  }

  get isDeleteWordButtonDisabled(): boolean {
    return this.entryForm.disabled;
  }

  addMeaning(): void {
    assert(this.entry.meanings.length < entryPropertiesValidationValues.meaningsMaxLength,
      `The entry contains ${this.entry.meanings.length} meanings while the allowable value is ${entryPropertiesValidationValues.meaningsMaxLength}`);

    this.entry.meanings.push(this.entryFactory.createMeaning());
    this.createFormMeaning(this.entry.meanings.length - 1);
  }

  createFormMeaning(index: number): void {
    assert(this.entry.meanings[index] !== undefined,
      `There is no meaning at the ${index} index`);
    assert(this.entryForm.controls.meanings.value[index] === undefined,
      `There is a meaning form control at the ${index} index already`);

    const definition: string = this.entry.meanings[index]!.definition;
    const examples: string[] = this.entry.meanings[index]!.examples;
    const examplesFormControls: FormControl<string>[] = examples.map(
      (example: string) => this.formBuilder.nonNullable.control(example, [
        onlyWhiteSpacesPreventionValidator,
        Validators.minLength(this.entryPropertiesValidationValues.exampleMinLength),
        Validators.maxLength(this.entryPropertiesValidationValues.exampleMaxLength),
      ])
    );
    const formMeaning: FormMeaning = this.formBuilder.nonNullable.group({
      definition: [
        definition,
        [
          onlyWhiteSpacesPreventionValidator,
          Validators.minLength(this.entryPropertiesValidationValues.definitionMinLength),
          Validators.maxLength(this.entryPropertiesValidationValues.definitionMaxLength),
        ]
      ],
      examples: this.formBuilder.nonNullable.array(examplesFormControls)
    });
    this.entryForm.controls.meanings.value[index] = formMeaning;
  }

  get isAddMeaningButtonDisabled(): boolean {
    return this.entry.meanings.length === entryPropertiesValidationValues.meaningsMaxLength ||
      this.entryForm.controls.meanings.disabled;
  }

  getMeaningState(index: number): 'default' | 'being-edited' | 'deleted' {
    if (this.entryForm.controls.meanings.value[index]) {
      return 'being-edited';
    }
    if (this.deletedMeaningsIndexes[index]) {
      return 'deleted';
    }
    return 'default';
  }

  private deletedMeaningsIndexes: { [index: number]: true } = {};

  editMeaning(index: number): void {
    this.createFormMeaning(index);
  }

  get isEditMeaningButtonDisabled(): boolean {
    return this.entryForm.controls.meanings.disabled;
  }

  deleteMeaning(index: number): void {
    assert(this.entry.meanings[index] !== undefined,
      `There is no meaning at the ${index} index`);
    assert(this.entryForm.controls.meanings.value[index] === undefined,
      `There is a meaning form control at the ${index} index`);

    this.deletedMeaningsIndexes[index] = true;
    this.isEntryChanged = true;
  }

  get isDeleteMeaningButtonDisabled(): boolean {
    return this.entryForm.controls.meanings.disabled;
  }

  acceptMeaningEdition(index: number): void {
    assert(this.entryForm.controls.meanings.value[index] !== undefined,
      `There is no meaning form control at the ${index} index`);
    assert(this.entryForm.controls.meanings.value[index]!.valid,
      `The meaning form control at the ${index} index is invalid`);
    assert(this.entry.meanings[index] !== undefined,
      `There is no meaning at the ${index} index`);

    this.entry.meanings[index] = this.entryForm.controls.meanings.value[index]!.value as Meaning;
    this.isEntryChanged = true;
    delete this.entryForm.controls.meanings.value[index];
  }

  isAcceptMeaningEditionDisabled(index: number): boolean {
    return !this.entryForm.controls.meanings.value[index]!.valid;
  }

  discardMeaningEdition(index: number): void {
    assert(this.entryForm.controls.meanings.value[index] !== undefined,
      `There is no meaning form control at the ${index} index`);
    assert(this.entry.meanings[index] !== undefined,
      `There is no meaning at the ${index} index`);

    if (this.isMeaningEmpty(index)) {
      this.deleteEmptyMeaning(index);
    }
    delete this.entryForm.controls.meanings.value[index];
  }

  private isMeaningEmpty(index: number): boolean {
    return this.entry.meanings[index]!.definition.length < this.entryPropertiesValidationValues.definitionMinLength;
  }

  private deleteEmptyMeaning(index: number): void {
    this.entry.meanings[index] = this.entryForm.controls.meanings.value[index]!.value as Meaning;
    this.deletedMeaningsIndexes[index] = true;
  }

  restoreDeletedMeaning(index: number): void {
    assert(this.entry.meanings[index] !== undefined,
      `There is no meaning at the ${index} index`);
    assert(this.deletedMeaningsIndexes[index] !== undefined,
      `There is no deleted meaning with such an index as ${index}`);

    delete this.deletedMeaningsIndexes[index];
    if (this.isMeaningEmpty(index)) {
      this.createFormMeaning(index); // should be done for every discarded new meaning
    }
  }

  get isRestoreDeletedMeaningButtonDisabled(): boolean {
    return this.entryForm.controls.meanings.disabled;
  }

  async onFormSubmit(): Promise<void> {
    if (this.entry.words.length < this.entryPropertiesValidationValues.wordsMinLength) {
      return this.notifyOfInsufficientWordNumber();
    }
    await this.addOrUpdateEntry();
  }

  private notifyOfInsufficientWordNumber(): void {
    this.updateNewWordTextInputStatus('Please add at least one related word', TextInputState.error);
    const entryWordsElement = document.getElementById('words') as HTMLElement;
    entryWordsElement.scrollIntoView({ behavior: 'smooth' });
  }

  private async addOrUpdateEntry(): Promise<void> {
    this.entryForm.disable();
    this.deleteMarkedAsDeletedMeanings();
    await this.entryService.addOrUpdate(this.entry);
    this.isEntryChanged = false;
    this.router.navigate([navigationPaths.entryList]);
  }

  private deleteMarkedAsDeletedMeanings(): void {
    this.entry.meanings = this.entry.meanings.filter((meaning, index) =>
      !this.deletedMeaningsIndexes[index]
    );
  }

  get isSubmitButtonDisabled(): boolean {
    return !this.isEntryChanged ||
      Object.keys(this.entryForm.controls.meanings.value).length !== 0 ||
      this.entryForm.disabled;
  }

  get isCancelButtonDisabled(): boolean {
    return this.entryForm.disabled;
  }

  onCancelClick(): void {
    this.router.navigate([navigationPaths.entryList]);
  }

  ngOnDestroy(): void {
    this.entrySubscription.unsubscribe();
  }
}
