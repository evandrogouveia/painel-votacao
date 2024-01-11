import { Component, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() data?: any = [];

  constructor(
    private modalService: BsModalService,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.modalService.hide();
  }
}
