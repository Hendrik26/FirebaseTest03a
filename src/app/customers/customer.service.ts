import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Customer} from './customer';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    private dbPath = '/customers';
    private dbOrder = 'name';
    private dbSelect = 'name';

    private partialValue: Partial<any>;

    customersRef: AngularFireList<Customer> = null;
    customersRefOne: AngularFireList<Customer> = null;
    minString: string;
    maxString: string;

    constructor(private db: AngularFireDatabase) {
    }

    queryAllCustomers(): void {
        this.customersRef = this.db.list(this.dbPath, ref => ref.orderByChild(this.dbOrder));
    }

    /*  querySomeCustomers(): void {
        this.customersRef = this.db.list(this.dbPath, ref => ref.orderByChild(this.dbOrder).where('name', '>=', 'f'));
    } */

    queryStartCustomers(): void {
        this.customersRef = this.db.list(this.dbPath, ref => ref.orderByChild(this.dbOrder).startAt('F').endAt('V'));
    }

    queryStartCustomersNew(): void {
        this.customersRef = this.db.list(this.dbPath, ref => ref.orderByChild(this.dbOrder).startAt(this.trim0(this.minString))
            .endAt(this.trimZ(this.maxString)));
    }

    queryCustomerByKey(key): void {
        this.customersRef = this.db.list(this.dbPath, ref => ref.orderByKey().equalTo(key));
    }

    createCustomer(customer: Customer): void {
        this.customersRef.push(customer);
    }

    updateCustomer(key: string, value: any): void {
        console.log('-------------');
        console.log('class CustomerService Method updateCustomer()');
        // this.customersRef.update(key, value).catch(error => this.handleError(error));
        const path = this.dbPath + '/' + key;
        // this.db.object(path).update(value);
        // Partial<any> partialValue = value;
        this.partialValue = value;
        this.db.object(path).update(this.partialValue);
    }

    deleteCustomer(key: string): void {
        this.customersRef.remove(key).catch(error => this.handleError(error));
    }

    getCustomersList(): Observable<any> {
        return this.customersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            )
        );
    }

    getCustomerObjectByKey(key: string): Observable<any> {
        const path = this.dbPath + '/' + key;
        return this.db.object(path).valueChanges();
    }

    deleteAll(): void {
        this.customersRef.remove().catch(error => this.handleError(error));
    }

    private handleError(error) {
        console.log(error);
    }

    private trim0(value: string): string {
        if (value === undefined){
            value = '0';
        }
        if (value === null){
            value = '0';
        }
        value = value.trim();
        if (value == ''){
            value = '0';
        }
        return value;
    }

    private trimZ(value: string): string {
        if (value === undefined){
            value = 'ZZZZZZZZZZZZZZZZZZZZ';
        }
        if (value == null){
            value = 'ZZZZZZZZZZZZZZZZZZZZ';
        }
        value = value.trim();
        if (value == ''){
            value = 'ZZZZZZZZZZZZZZZZZZZZ';
        }
        return value;
    }
}
