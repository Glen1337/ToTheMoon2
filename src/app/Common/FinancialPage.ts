import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

// @Component({
//     template: ''
// })
@Injectable()
export class FinancialPage implements OnDestroy {

    public errorMsg: string = '';
    public noticeMsg: string = '';
    public warningMsg: string = '';

    public subscriptions: Subscription[] = [];

    constructor() {
    }

    messageClick(): void {
        this.errorMsg = '';
        this.noticeMsg = '';
        this.warningMsg = '';
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length > 0) {
            this.subscriptions.forEach((sub) => {
                if (!sub.closed) { sub.unsubscribe(); }
            });
        }
    }
}
