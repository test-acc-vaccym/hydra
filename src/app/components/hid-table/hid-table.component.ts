import {Component, OnInit, OnDestroy} from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import {ApiService} from '../../services/api.service';
import {HIDDevice} from '../../models/hid.device';

import {faCheckCircle, faTimes} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'hydra-hid-table',
    templateUrl: './hid-table.component.html',
    styleUrls: ['./hid-table.component.scss']
})
export class HidTableComponent implements OnInit, OnDestroy {
    devices: HIDDevice[];
    sort: ColumnSortedEvent;
    sortSub: any;
    query: string = '';

    faCheckCircle = faCheckCircle;
    faTimes = faTimes;

    constructor(private api: ApiService, private sortService: SortService) { 
        this.sort = {field: 'address', direction: 'asc', type:''};
        this.update(this.api.session.hid['devices']);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session.hid['devices']);
        });

        this.sortSub = this.sortService.onSort.subscribe(event => {
            this.sort = event;
            this.sortService.sort(this.devices, event);
        });
    }

    ngOnDestroy() {
        this.sortSub.unsubscribe();
    }

    clear() {
        this.api.cmd("hid.clear");
        this.devices = [];
    }

    private update(devices) {
        this.devices = devices; 
        this.sortService.sort(this.devices, this.sort);
    }
}
