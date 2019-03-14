import {CustomerType} from './customer-type';

export class Customer {
    key: string;
    name: string;
    age: number;
    active = true;

    public setData(data: CustomerType) {
        this.key = data.key;
        this.name = data.name;
        this.age = data.age;
        this.active = data.active;
    }
}
