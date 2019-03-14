import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

import {FormsModule} from '@angular/forms';

import {Customer} from '../customer';
import {CustomerService} from '../customer.service';
import {map} from 'rxjs/operators';


@Component({
    selector: 'create-customer',
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {

    customer: Customer = new Customer();
    customers: any;
    customerId: string;
    submitted = false;
    receivedCustomerIdError = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private customerService: CustomerService
    ) {
    }

    private hasReceivedCustomerId(): // can NOT be deleted
        boolean {
        console.log('private method hasReceivedCustomerId()');
        if (this.route.snapshot.paramMap.has('customerId')) {
            this.customerId = this.route.snapshot.paramMap.get('customerId');  // get customerId from URL
            console.log('if-Zweig');
            console.log('this.customerId===' + this.customerId);
            console.log('--------------');
            return true;
        } else {
            this.customerId = null; // stands for the creation of a new customer
            console.log('else-Zweig');
            console.log('--------------');
            return false;
        }
    }

    ngOnInit() {
        // this.customerService.receiveAllCustomers();
        this.receivedCustomerIdError = !this.hasReceivedCustomerId();
        console.log('this.receivedCustomerIdError===' + this.receivedCustomerIdError);
        console.log('------------');

        if (this.receivedCustomerIdError) {
            this.customer = new Customer();
        } else {
            console.log('ngOnInit else');
            console.log('-------------');
            this.receiveCustomerByKey(this.customerId);
        }

    }

    newCustomer(): void {
        this.submitted = false;
        this.customer = new Customer();
    }


    private receiveCustomerByKeyOld002(key: string): void {
        this.customerService.queryCustomerByKey(key);
        this.customerService.getCustomersList().subscribe(customers => {
            this.customer = customers[0];

        });
    }

    private receiveCustomerByKey(key: string): void {
        this.customerService.getCustomerObjectByKey(key)
            .subscribe(customer => {this.customer = customer});
    }


    save() {
        console.log('-------------');
        console.log('class CreateCustomerComponent Method save()');
        if (this.receivedCustomerIdError) {
            console.log('class CreateCustomerComponent Method save() Error');
            this.customerService.createCustomer(this.customer);
            this.customer = new Customer();
        } else {
            console.log('class CreateCustomerComponent Method save() notError');
            if (this.customer !== undefined) {
                console.log('class CreateCustomerComponent Method save() CustomerDefined');
                this.updateCustomer();
            }
            this.router.navigateByUrl('customers');
        }
    }


    updateCustomer() {
        console.log('-------------');
        console.log('class CreateCustomerComponent Method updateCustomer()');
        this.customerService.updateCustomer(this.customerId, this.customer);
    }

    onSubmit() {
        this.submitted = true;
        this.save();
    }
}
